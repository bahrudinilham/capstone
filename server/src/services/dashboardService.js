import { subDays, startOfDay, differenceInCalendarDays } from "date-fns";
import prisma from "../lib/prisma.js";

const DEFAULT_TUTORIAL_MINUTES = 15;
const NON_LEARNING_PATH_NAMES = ["Non Learning Path"];

let nonLearningPathIdPromise;
async function getNonLearningPathId() {
  if (!nonLearningPathIdPromise) {
    nonLearningPathIdPromise = prisma.learningPath
      .findFirst({
        where: {
          learning_path_name: {
            in: NON_LEARNING_PATH_NAMES,
          },
        },
        select: { learning_path_id: true },
      })
      .then((path) => path?.learning_path_id ?? null)
      .catch((error) => {
        nonLearningPathIdPromise = null;
        throw error;
      });
  }
  return nonLearningPathIdPromise;
}

function computeCourseProgress(progress) {
  if (!progress) {
    return { percent: 0, status: "NOT_STARTED", isCompleted: false };
  }

  if (progress.is_graduated) {
    return { percent: 100, status: "COMPLETED", isCompleted: true };
  }

  const totalUnits = progress.completed_tutorials + progress.active_tutorials;
  const percent =
    totalUnits > 0
      ? Math.min(
          100,
          Math.round((progress.completed_tutorials / totalUnits) * 100)
        )
      : 0;
  const status =
    percent === 0
      ? "NOT_STARTED"
      : percent === 100
      ? "COMPLETED"
      : "IN_PROGRESS";

  return { percent, status, isCompleted: percent === 100 };
}

async function getTutorialCountMap(courseIds) {
  if (!courseIds.length) {
    return new Map();
  }

  const counts = await prisma.tutorial.groupBy({
    by: ["course_id"],
    where: { course_id: { in: courseIds } },
    _count: { course_id: true },
  });

  const map = new Map();
  counts.forEach((count) => {
    map.set(count.course_id, count._count.course_id);
  });
  return map;
}

function estimateProgressMinutes(entry, tutorialCounts) {
  const courseId = entry.Course?.course_id;
  const totalTutorials =
    (courseId ? tutorialCounts.get(courseId) : undefined) ??
    entry.completed_tutorials + entry.active_tutorials;
  if (!totalTutorials) {
    return 0;
  }

  const estimatedCourseMinutes = entry.Course?.hours_to_study
    ? entry.Course.hours_to_study * 60
    : totalTutorials * DEFAULT_TUTORIAL_MINUTES;
  const courseProgress = computeCourseProgress(entry);
  const ratio = Math.min(1, courseProgress.percent / 100);
  return Math.round(estimatedCourseMinutes * ratio);
}

async function fetchProgressEntries(studentId, dateFilter = {}) {
  return prisma.studentProgress.findMany({
    where: {
      student_id: studentId,
      ...dateFilter,
    },
    select: {
      completed_tutorials: true,
      active_tutorials: true,
      is_graduated: true,
      started_learning_at: true,
      Course: {
        select: {
          course_id: true,
          course_name: true,
          hours_to_study: true,
          learning_path_id: true,
        },
      },
    },
  });
}

export async function getWeeklyActivity(studentId) {
  const now = new Date();
  const currentWindowStart = startOfDay(subDays(now, 6));
  const previousWindowStart = startOfDay(subDays(currentWindowStart, 7));

  const [currentProgress, previousProgress] = await Promise.all([
    fetchProgressEntries(studentId, {
      started_learning_at: { gte: currentWindowStart },
    }),
    fetchProgressEntries(studentId, {
      started_learning_at: {
        gte: previousWindowStart,
        lt: currentWindowStart,
      },
    }),
  ]);

  const courseIds = [
    ...new Set(
      [...currentProgress, ...previousProgress]
        .map((entry) => entry.Course?.course_id)
        .filter((id) => typeof id === "number")
    ),
  ];
  const tutorialCounts = await getTutorialCountMap(courseIds);

  const dailyMinutes = Array(7).fill(0);
  currentProgress.forEach((entry) => {
    const dayIndex = differenceInCalendarDays(
      startOfDay(entry.started_learning_at),
      currentWindowStart
    );
    if (dayIndex >= 0 && dayIndex < 7) {
      dailyMinutes[dayIndex] += estimateProgressMinutes(entry, tutorialCounts);
    }
  });

  const dailySeries = dailyMinutes.map((value) => Math.round(value * 10) / 10);
  const cumulativeSeries = [];
  let running = 0;
  dailySeries.forEach((minutes) => {
    running += minutes;
    cumulativeSeries.push(Math.round(running * 10) / 10);
  });

  const totalMinutes = Math.round(
    cumulativeSeries[cumulativeSeries.length - 1] || 0
  );
  const previousMinutes = previousProgress.reduce(
    (total, entry) => total + estimateProgressMinutes(entry, tutorialCounts),
    0
  );

  const wowDeltaPct =
    previousMinutes > 0
      ? Math.round(((totalMinutes - previousMinutes) / previousMinutes) * 100)
      : null;

  return {
    totalMinutes,
    wowDeltaPct,
    cumulativeSeries,
    dailySeries,
  };
}

export async function getKpis(studentId) {
  const [progressEntries, assessmentCount, submissionCount] = await Promise.all(
    [
      fetchProgressEntries(studentId),
      prisma.studentProgress.count({
        where: { student_id: studentId, final_exam_id: { gt: 0 } },
      }),
      prisma.studentProgress.count({
        where: { student_id: studentId, final_submission_id: { gt: 0 } },
      }),
    ]
  );

  const courseIds = [
    ...new Set(
      progressEntries
        .map((entry) => entry.Course?.course_id)
        .filter((id) => typeof id === "number")
    ),
  ];
  const tutorialCounts = await getTutorialCountMap(courseIds);

  const inProgressCourses = new Set();
  const courseMinutesMap = new Map();
  progressEntries.forEach((entry) => {
    const courseId = entry.Course?.course_id;
    if (typeof courseId !== "number") return;

    const courseProgress = computeCourseProgress(entry);
    const hasProgress =
      entry.completed_tutorials > 0 ||
      entry.active_tutorials > 0 ||
      courseProgress.percent > 0;
    if (hasProgress) {
      inProgressCourses.add(courseId);
      const minutes = estimateProgressMinutes(entry, tutorialCounts);
      const existing = courseMinutesMap.get(courseId) ?? 0;
      courseMinutesMap.set(courseId, Math.max(existing, minutes));
    }
  });
  const courseCount = inProgressCourses.size;

  const totalMinutes = Array.from(courseMinutesMap.values()).reduce(
    (sum, minutes) => sum + minutes,
    0
  );
  const learningHours = Math.round(totalMinutes / 60);

  return {
    courses: courseCount,
    learningHours,
    assessments: assessmentCount,
    submissions: submissionCount,
  };
}

function pickRandomPath(paths) {
  if (!paths.length) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * paths.length);
  return paths[randomIndex];
}

export async function getRecommendedPath(studentId) {
  const nonLearningPathId = await getNonLearningPathId();
  const progressEntries = await prisma.studentProgress.findMany({
    where: { student_id: studentId },
    orderBy: { started_learning_at: "desc" },
    include: {
      LearningPath: true,
    },
  });

  const validEntries = progressEntries.filter(
    (entry) =>
      nonLearningPathId === null || entry.learning_path_id !== nonLearningPathId
  );

  const takenPathIds = new Set(
    validEntries.map((entry) => entry.learning_path_id)
  );
  const excludedPathIds = Array.from(takenPathIds);
  if (nonLearningPathId !== null) {
    excludedPathIds.push(nonLearningPathId);
  }

  const candidatePaths = await prisma.learningPath.findMany({
    where: {
      ...(excludedPathIds.length
        ? { learning_path_id: { notIn: excludedPathIds } }
        : {}),
    },
    orderBy: { learning_path_id: "asc" },
    include: {
      Course: true,
    },
    take: 5,
  });

  const recommendation = pickRandomPath(candidatePaths);
  if (!recommendation) {
    return null;
  }

  return {
    id: recommendation.learning_path_id,
    title: recommendation.learning_path_name,
    totalCourses: recommendation.Course.length,
  };
}

export async function getProgressMap(studentId) {
  const entries = await prisma.studentProgress.findMany({
    where: { student_id: studentId },
    select: {
      completed_tutorials: true,
      active_tutorials: true,
      is_graduated: true,
      Course: {
        select: { course_id: true, course_name: true, learning_path_id: true },
      },
    },
  });

  const map = new Map();
  entries.forEach((entry) => {
    const courseName = entry.Course?.course_name || "Unknown Course";
    const payload = {
      completed_tutorials: entry.completed_tutorials,
      active_tutorials: entry.active_tutorials,
      is_graduated: entry.is_graduated,
      course_name: courseName,
      learning_path_id: entry.Course?.learning_path_id || null,
    };
    const courseId = entry.Course?.course_id;
    if (typeof courseId === "number") {
      map.set(courseId, payload);
    }
    map.set(courseName, payload);
  });
  return map;
}

export async function getPathsOverview(studentId) {
  const nonLearningPathId = await getNonLearningPathId();
  const learningPathWhere =
    nonLearningPathId !== null
      ? { learning_path_id: { not: nonLearningPathId } }
      : undefined;
  const [paths, progressMap] = await Promise.all([
    prisma.learningPath.findMany({
      where: learningPathWhere,
      include: {
        Course: {
          orderBy: { course_id: "asc" },
        },
      },
    }),
    getProgressMap(studentId),
  ]);

  const enrichedPaths = paths.map((path) => {
    const totalCourses = path.Course.length;
    let completedCourses = 0;
    let startedCourses = 0;
    let percentSum = 0;
    let hasProgress = false;

    path.Course.forEach((course) => {
      const progress = progressMap.get(course.course_id);
      if (!progress) return;

      const courseProgress = computeCourseProgress(progress);
      percentSum += courseProgress.percent;
      hasProgress =
        hasProgress ||
        progress.completed_tutorials > 0 ||
        progress.active_tutorials > 0;
      if (courseProgress.percent > 0) {
        startedCourses += 1;
      }
      if (courseProgress.isCompleted) {
        completedCourses += 1;
      }
    });

    const percent = totalCourses ? Math.round(percentSum / totalCourses) : 0;

    return {
      data: {
        id: path.learning_path_id,
        title: path.learning_path_name,
        official: true,
        percent,
        completedLessons: completedCourses,
        startedLessons: startedCourses,
        totalLessons: totalCourses,
      },
      hasProgress: hasProgress || startedCourses > 0,
    };
  });

  const activePathIds = new Set(
    Array.from(progressMap.values(), (entry) => entry.learning_path_id).filter(
      (id) => id && id !== nonLearningPathId
    )
  );

  return enrichedPaths
    .filter((path) => path.hasProgress || activePathIds.has(path.data.id))
    .map((path) => path.data);
}

export async function getPathDetail(studentId, pathId) {
  const path = await prisma.learningPath.findUnique({
    where: { learning_path_id: Number(pathId) },
    include: {
      Course: {
        orderBy: { course_id: "asc" },
      },
    },
  });

  if (!path) {
    return null;
  }

  const progressMap = await getProgressMap(studentId);
  const lessons = [];

  path.Course.forEach((course) => {
    const progress = progressMap.get(course.course_id);
    const courseProgress = computeCourseProgress(progress);

    lessons.push({
      id: course.course_id,
      title: course.course_name,
      courseTitle: course.course_name,
      percent: courseProgress.percent,
      status: courseProgress.status,
    });
  });

  return {
    id: path.learning_path_id,
    title: path.learning_path_name,
    lessons,
  };
}

export async function getStandaloneCourses(studentId) {
  const nonLearningPathId = await getNonLearningPathId();
  if (nonLearningPathId === null) {
    return [];
  }

  const entries = await prisma.studentProgress.findMany({
    where: {
      student_id: studentId,
      learning_path_id: nonLearningPathId,
    },
    include: {
      Course: {
        select: {
          course_id: true,
          course_name: true,
        },
      },
    },
  });

  return entries
    .filter((entry) => entry.Course)
    .map((entry) => {
      const courseProgress = computeCourseProgress(entry);
      return {
        id: entry.Course.course_id,
        title: entry.Course.course_name,
        percent: courseProgress.percent,
      };
    });
}
