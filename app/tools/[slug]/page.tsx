import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolDetailClient from '../../../components/ToolDetailClient';
import { tools } from '../../../lib/tools';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = tools.find((item) => item.slug === params.slug);
  if (!tool) return { title: 'Tool not found', description: 'Requested tool is not available.' };
  return {
    title: `${tool.name} · ReByte`,
    description: tool.description,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: { title: `${tool.name} · ReByte`, description: tool.description, type: 'website' },
  };
}

export default function ToolDetailPage({ params }: Props) {
  if (!tools.some((tool) => tool.slug === params.slug)) notFound();
  return <ToolDetailClient slug={params.slug} />;
}
