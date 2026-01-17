'use client';

import { useTranslations } from 'next-intl';
import { ToolHighlighter } from '../about/components/ToolHighlighter';
import { Mail, Phone, Send, MapPin, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

    const jobs = t.raw('jobs') as Job[];
    const summary = t.raw('summary') as string[];
    const skillsList = (t('skills') as string).split(',').map(s => s.trim());
    const educationProjects = t.raw('education.projects') as string[];

    return (
        <div className="max-w-[210mm] mx-auto bg-white p-[15mm] text-black min-h-screen">
            {/* Header */}
            <header className="mb-8 border-b-2 border-slate-800 pb-4">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">
                    {t('name')}
                </h1>
                <p className="text-xl text-slate-700 font-semibold mb-4">
                    {t('role')}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        <span>+7 (932) 477-0975</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4" />
                        <span>hohlov.03@inbox.ru</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Send className="h-4 w-4" />
                        <Link href="https://t.me/diametrfq" className="underline hover:text-blue-600">@diametrfq</Link>
                    </div>
                </div>
            </header>

            {/* Summary */}
            <section className="mb-6">
                <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-3 pb-1 text-slate-800">
                    Summary
                </h2>
                <div className="text-sm leading-relaxed text-slate-700 space-y-2 text-justify">
                    {summary.map((paragraph, index) => (
                        <p key={index}>
                            <ToolHighlighter text={paragraph} className="print-highlighter" />
                        </p>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="mb-6">
                <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-4 pb-1 text-slate-800">
                    {t('experienceTitle')}
                </h2>
                <div className="space-y-6">
                    {jobs.map((job, index) => (
                        <div key={index} className="break-inside-avoid">
                            <div className="flex justify-between items-baseline mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                                        <span>{job.company}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <MapPin className="h-3 w-3" /> {job.location}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <div className="font-semibold text-slate-800">{job.period}</div>
                                    <div className="text-slate-500 text-xs">{job.duration}</div>
                                </div>
                            </div>

                            <ul className="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                                {job.description.map((desc, i) => (
                                    <li key={i} className="pl-1">
                                        <ToolHighlighter text={desc} className="print-highlighter" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="mb-6 break-inside-avoid">
                <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-4 pb-1 text-slate-800">
                    {t('educationTitle')}
                </h2>

                <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{t('education.university')}</h3>
                        <span className="font-semibold text-sm text-slate-800">{t('education.year')}</span>
                    </div>
                    <p className="text-slate-700">{t('education.degree')}</p>
                </div>

                <div className="mt-3">
                    <h4 className="font-bold text-slate-800 mb-2 text-sm">{t('education.projectTitle')}</h4>
                    <ul className="grid grid-cols-1 gap-1 text-sm text-slate-700">
                        {educationProjects.map((project, i) => (
                            <li key={i} className="flex gap-2 items-start">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                                <span><ToolHighlighter text={project} className="print-highlighter" /></span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Skills */}
            <section className="break-inside-avoid">
                <h2 className="text-xl font-bold uppercase border-b border-slate-300 mb-4 pb-1 text-slate-800">
                    {t('skillsTitle')}
                </h2>
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
                    {skillsList.map((skill, index) => (
                        <span key={index} className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-800 font-medium print:border-slate-300">
                            <ToolHighlighter text={skill} className="print-highlighter" />
                        </span>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                <p>Generated from diametrfq.com</p>
            </footer>
        </div>
    );
}
