import { proposals } from 'drizzle/schema';
import { InsertProposalSchema } from '~/schemas/proposals';
import { db } from '~/utils/db.server';

type CreateProposal = typeof proposals.$inferInsert;

export async function createProposal(data: CreateProposal) {
	const values = InsertProposalSchema.parse(data);
	return db
		.insert(proposals)
		.values(values)
		.returning({ insertedId: proposals.id });
}

export async function getProposalByOwnerEmail(email: string) {
	return db.query.proposals.findFirst({
		where: (proposals, { eq }) => eq(proposals.ownerEmail, email)
	});
}
