'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Download, Mail, Phone, Send, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ToolHighlighter } from './components/ToolHighlighter';

interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  duration: string;
  description: string[];
}

export default function ResumePage() {
  const t = useTranslations('AboutPage');
  const locale = useLocale();
  const [showContact, setShowContact] = useState(false);
  // Track open state for each job independently
  const [openJobs, setOpenJobs] = useState<number[]>([]);
  const [isEducationProjectsOpen, setIsEducationProjectsOpen] = useState(false);

  const toggleJob = (index: number) => {
    setOpenJobs(current =>
      current.includes(index)
        ? current.filter(i => i !== index)
        : [...current, index]
    );
  };

  const jobs = t.raw('jobs') as Job[];
  const summary = t.raw('summary') as string[];
  const skillsList = (t('skills') as string).split(',').map(s => s.trim());
  const educationProjects = t.raw('education.projects') as string[];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <header className="text-center mb-16 relative">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none" />

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent pb-2">
          {t('name')}
        </h1>
        <p className="text-2xl text-muted-foreground font-medium mb-8">
          {t('role')}
        </p>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Button
            onClick={() => setShowContact(!showContact)}
            variant={showContact ? "default" : "outline"}
            className="rounded-full transition-all duration-300"
          >
            {showContact ? t('hideContacts') : t('showContacts')}
          </Button>

          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white dark:text-black shadow-lg hover:shadow-xl transition-all duration-300">
            <a href={`/resume/${locale === 'ru' ? 'Хохлов_Дмитрий_Fullstack.pdf' : 'Khokhlov_Dmitry_Fullstack.pdf'}`} download target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              {t('downloadResume')}
            </a>
          </Button>
        </div>

        {showContact && (
          <div className="mt-8 p-6 bg-card border rounded-2xl shadow-lg inline-block text-left animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid gap-3 text-card-foreground">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+7 (932) 477-0975</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>hohlov.03@inbox.ru</span>
              </div>
              <div className="flex items-center gap-3">
                <Send className="h-4 w-4 text-primary" />
                <Link href="https://t.me/diametrfq" target="_blank" className="hover:underline hover:text-primary transition-colors">
                  @diametrfq
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="space-y-16">
        <section className="prose dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            {t('title')}
          </h2>
          <div className="text-lg leading-relaxed text-muted-foreground space-y-4">
            {summary.map((paragraph, index) => (
              <p key={index}>
                <ToolHighlighter text={paragraph} />
              </p>
            ))}
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            {t('experienceTitle')}
          </h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <Collapsible
                key={index}
                open={openJobs.includes(index)}
                onOpenChange={() => toggleJob(index)}
                className="group bg-card hover:bg-accent/5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:border-primary/20"
              >
                <CollapsibleTrigger className="w-full text-left p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-lg font-medium text-muted-foreground">
                        {job.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <div className="text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-lg">
                        <span className="font-semibold">{job.period}</span>
                        <span className="ml-2 opacity-75">| {job.duration}</span>
                      </div>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform duration-200",
                        openJobs.includes(index) ? "transform rotate-180" : ""
                      )} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="bg-primary/10 px-2 py-0.5 rounded text-primary">{job.location}</span>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-6 pb-6 pt-0">
                    <ul className="space-y-2 text-muted-foreground/90 pt-4 border-t border-border/50">
                      {job.description.map((desc, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span className="leading-relaxed">
                            <ToolHighlighter text={desc} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            {t('educationTitle')}
          </h2>
          <div className="bg-card rounded-xl border p-6 hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
              <div>
                <h3 className="text-xl font-bold">{t('education.university')}</h3>
                <p className="text-muted-foreground mt-1">{t('education.degree')}</p>
              </div>
              <span className="bg-secondary px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
                {t('education.year')}
              </span>
            </div>

            <Collapsible
              open={isEducationProjectsOpen}
              onOpenChange={setIsEducationProjectsOpen}
              className="mt-6 pt-6 border-t border-border/50"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between font-semibold mb-3 group hover:text-primary transition-colors">
                {t('education.projectTitle')}
                <ChevronDown className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  isEducationProjectsOpen ? "transform rotate-180" : ""
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="space-y-2 text-muted-foreground animation-in slide-in-from-top-2 fade-in duration-300">
                  {educationProjects.map((project, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>
                        <ToolHighlighter text={project} />
                      </span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            {t('skillsTitle')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-secondary/50 hover:bg-primary/10 hover:text-primary rounded-full text-sm font-medium transition-colors cursor-default border border-transparent hover:border-primary/20"
              >
                <ToolHighlighter text={skill} />
              </span>
            ))}
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            {t('projectsTitle')}
          </h2>
          <div className="p-6 bg-gradient-to-br from-card to-accent/20 rounded-xl border text-center">
            <p className="text-lg text-muted-foreground mb-4">
              {t('projectsDescription')}
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="https://github.com/DiametrFQ" target="_blank" className="flex items-center gap-2">
                GitHub
                <Send className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}