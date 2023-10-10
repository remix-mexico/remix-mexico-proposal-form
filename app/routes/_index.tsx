import {
	json,
	type ActionFunctionArgs,
	type MetaFunction
} from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import { conform, useForm } from '@conform-to/react';
import { InsertProposalSchema } from '~/schemas/proposals';
import { Button } from '~/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { useId } from 'react';
import {
	createProposal,
	getProposalByOwnerEmail
} from '~/models/proposals.server';
import { z } from 'zod';

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' }
	];
};

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = await parse(formData, {
		schema: InsertProposalSchema.superRefine(async (data, ctx) => {
			const existingProposal = await getProposalByOwnerEmail(data.ownerEmail);

			if (existingProposal) {
				ctx.addIssue({
					path: ['ownerEmail'],
					code: z.ZodIssueCode.custom,
					message:
						'Ya existe una propuesta con este correo electrónico, espera a que sea revisada'
				});
				return;
			}
		}),
		async: true
	});

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const);
	}

	if (!submission.value) {
		return json({ status: 'error', submission } as const, { status: 400 });
	}

	const response = await createProposal(submission.value);
	if (response.length && response[0].insertedId) {
		return json({ status: 'success', submission } as const, { status: 201 });
	}

	submission.error[''] = ['Ocurrió un error al registrar tu propuesta'];
	return json({ status: 'error', submission } as const, { status: 500 });
}

export default function Index() {
	const lastSubmission = useActionData<typeof action>();

	const navigation = useNavigation();
	const isPending = navigation.state === 'submitting';

	const id = useId();
	const [form, fields] = useForm({
		id,
		lastSubmission: lastSubmission?.submission,
		constraint: getFieldsetConstraint(InsertProposalSchema),
		shouldValidate: 'onBlur',
		onValidate({ formData }) {
			return parse(formData, { schema: InsertProposalSchema });
		}
	});

	if (lastSubmission?.status === 'success') {
		return (
			<main className='container h-full pt-20'>
				<section className='mt-10 flex flex-col items-center justify-center gap-y-2 lg:mt-40'>
					<h1 className='scroll-m-20 pr-8 text-4xl font-extrabold tracking-tight lg:p-0 lg:text-5xl'>
						!Gracias por tu propuesta!
					</h1>
					<p className='text-xl text-muted-foreground'>
						En breve nos pondremos en contacto contigo
					</p>
				</section>
			</main>
		);
	}

	return (
		<main className='container h-full pt-20'>
			<section className='mt-10 flex flex-col items-center justify-center gap-y-2 lg:mt-40'>
				<h1 className='scroll-m-20 pr-8 text-4xl font-extrabold tracking-tight lg:p-0 lg:text-5xl'>
					!Bienvenidos a Remix México!
				</h1>
				<p className='text-xl text-muted-foreground'>
					Se parte de nuestra comunidad y aplica para ser speaker en nuestro
					meetup
				</p>
			</section>

			<section className='mt-10 flex flex-col items-center pb-10 lg:mt-20 lg:pb-0'>
				<Card className='lg:w-1/2'>
					<CardHeader>
						<CardTitle className='text-xl'>Registra tu propuesta</CardTitle>
						<CardDescription className='text-base'>
							Completa el siguiente formulario para registrar tu propuesta
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form method='post' className='space-y-6' {...form.props}>
							<div className='space-y-2'>
								{/* Owner name */}
								<Label htmlFor={fields.ownerName.id} className='text-base'>
									Nombre completo*
								</Label>
								<Input
									placeholder='Nombre completo'
									{...conform.input(fields.ownerName, { type: 'text' })}
								/>
								<div
									id={fields.ownerName.errorId}
									className='text-sm text-destructive'
								>
									{fields.ownerName.errors}
								</div>
							</div>

							{/* Owner email */}
							<div className='space-y-2'>
								<Label htmlFor={fields.ownerEmail.id} className='text-base'>
									Correo Electrónico*
								</Label>
								<Input
									placeholder='Correo electrónico'
									{...conform.input(fields.ownerEmail, { type: 'email' })}
								/>
								<div
									id={fields.ownerEmail.errorId}
									className='text-sm text-destructive'
								>
									{fields.ownerEmail.errors}
								</div>
							</div>

							{/* Title */}
							<div className='space-y-2'>
								<Label htmlFor={fields.title.id} className='text-base'>
									Titulo de la charla*
								</Label>
								<Input
									placeholder='Titulo de la charla'
									{...conform.input(fields.title, { type: 'text' })}
								/>
								<div
									id={fields.title.errorId}
									className='text-sm text-destructive'
								>
									{fields.title.errors}
								</div>
							</div>

							{/* Description */}
							<div className='space-y-2'>
								<Label htmlFor={fields.description.id} className='text-base'>
									Descripción de la charla
								</Label>
								<Textarea
									rows={10}
									placeholder='Descripción de la charla'
									{...conform.textarea(fields.description)}
								/>
								<div
									id={fields.description.errorId}
									className='text-sm text-destructive'
								>
									{fields.description.errors}
								</div>
							</div>
						</Form>
					</CardContent>
					<CardFooter className='flex flex-row-reverse'>
						<Button form={form.id} size='lg' disabled={isPending}>
							{isPending ? 'Enviando...' : 'Enviar'}
						</Button>
					</CardFooter>
				</Card>
			</section>
		</main>
	);
}
