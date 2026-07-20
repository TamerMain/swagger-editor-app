import { render, screen } from '@/lib/test-utils';
import { describe, it, expect, vi } from 'vitest';
import messages from '@/messages/en.json';

vi.mock('next-intl/server', () => ({
  getLocale: async () => 'en',
  getTranslations: async (namespace?: string) => {
    return (key: string) => {
      const path = namespace ? `${namespace}.${key}` : key;
      return path
        .split('.')
        .reduce<unknown>(
          (acc, part) =>
            acc && typeof acc === 'object'
              ? (acc as Record<string, unknown>)[part]
              : undefined,
          messages,
        ) as string;
    };
  },
}));

import AboutPage from './page';
import { TEAM, TECH_STACK } from '@/constants/constants';

describe('AboutPage', () => {
  it('renders the page heading and project description', async () => {
    render(await AboutPage());

    expect(
      screen.getByRole('heading', { level: 1, name: /about the project/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/openapi specification/i)).toBeInTheDocument();
  });

  it('renders the RS School section with a link to the course site', async () => {
    render(await AboutPage());

    expect(
      screen.getByRole('heading', { level: 2, name: /rs school/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rs\.school/i })).toHaveAttribute(
      'href',
      'https://rs.school/',
    );
  });

  it('renders every team member with a role and a GitHub link', async () => {
    render(await AboutPage());

    for (const member of TEAM) {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: `@${member.github}` }),
      ).toHaveAttribute('href', `https://github.com/${member.github}`);
    }
  });

  it('renders the tech stack', async () => {
    render(await AboutPage());

    for (const tech of TECH_STACK) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it('links back to the editor', async () => {
    render(await AboutPage());

    expect(
      screen.getByRole('link', { name: /open the editor/i }),
    ).toHaveAttribute('href', '/');
  });
});
