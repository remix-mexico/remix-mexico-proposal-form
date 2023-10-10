import { createInsertSchema } from 'drizzle-zod';
import { proposals } from 'drizzle/schema';
import { z } from 'zod';

export const InsertProposalSchema = createInsertSchema(proposals, {
	ownerName: z.string({ required_error: 'El nombre es requerido' }),
	ownerEmail: z
		.string({ required_error: 'El correo es requerido' })
		.email({ message: 'El correo no es válido' }),
	title: z.string({ required_error: 'El título es requerido' }),
	description: z
		.string({ invalid_type_error: 'La descripción no es válida' })
		.optional()
});
