import { generateRobotsTxt } from '@nasa-gcn/remix-seo';
import { type DataFunctionArgs } from '@remix-run/node';
import { getDomainUrl } from '~/utils/misc';

export function loader({ request }: DataFunctionArgs) {
	return generateRobotsTxt([
		{ type: 'sitemap', value: `${getDomainUrl(request)}/sitemap.xml` }
	]);
}
