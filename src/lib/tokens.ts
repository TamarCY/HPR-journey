import { prisma } from "@/lib/db";
import { generateParticipantToken } from "@/lib/generateToken";

type CreateParticipantTokenInput = {
  participantId: string;
  baseUrl: string;
};

export async function createParticipantToken({
  participantId,
  baseUrl,
}: CreateParticipantTokenInput) {
  const { token, tokenHash } = generateParticipantToken();

  const participantToken = await prisma.participantToken.create({
    data: {
      participantId,
      tokenHash,
      isActive: true,
    },
  });

  const personalUrl = `${baseUrl}/t/${token}`;

  return {
    token,
    personalUrl,
    participantToken,
  };
}
