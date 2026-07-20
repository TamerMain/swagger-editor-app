import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { TEAM, TECH_STACK } from '@/constants/constants';

export default async function AboutPage() {
  const t = await getTranslations('About');

  return (
    <main className="scroll-container flex-1 overflow-y-auto">
      <div className="w-[80vw] mx-auto py-12 space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
          <p className="text-neutral-300 leading-relaxed">{t('project')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{t('course.title')}</h2>
          <p className="text-neutral-300 leading-relaxed mb-3">
            {t('course.description')}
          </p>
          <a
            href="https://rs.school/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            rs.school
          </a>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('team.title')}</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {TEAM.map((member) => (
              <li
                key={member.github}
                className="rounded-lg border border-neutral-700 bg-neutral-900/60 p-4"
              >
                <p className="font-semibold text-white">{member.name}</p>
                <p className="text-sm text-neutral-400 mb-2">
                  {t(`team.roles.${member.role}`)}
                </p>
                <a
                  href={`https://github.com/${member.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  @{member.github}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('stack.title')}</h2>
          <ul className="flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <li
                key={tech}
                className="rounded border border-neutral-700 px-3 py-1 text-sm text-neutral-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{t('links.title')}</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blue-400 hover:underline">
                {t('links.editor')}
              </Link>
            </li>
            <li>
              <a
                href="https://www.openapis.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {t('links.openapi')}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
