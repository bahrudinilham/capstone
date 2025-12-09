import prisma from "../lib/prisma.js";
import { signToken } from "../utils/jwt.js";

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function buildAuthResponse(student) {
  const token = signToken({ id: student.student_id, email: student.email });
  return {
    token,
    user: {
      id: student.student_id,
      name: student.name,
      email: student.email,
    },
  };
}

export async function loginStudent({ name, email }) {
  if (!name || !email) {
    throw createHttpError(400, "Name and email are required");
  }

  const student = await prisma.student.findUnique({ where: { email } });
  if (!student || student.name !== name) {
    throw createHttpError(401, "Invalid credentials");
  }

  return buildAuthResponse(student);
}
