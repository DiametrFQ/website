import React from 'react';

const toolsMap: Record<string, string> = {
    // Languages & Core
    'TypeScript': 'text-[#3178C6] font-semibold',
    'JavaScript': 'text-[#F7DF1E] font-semibold',
    'Rust': 'text-[#DEA584] font-semibold hover:text-[#000000] dark:hover:text-[#DEA584]',
    'SQL': 'text-[#003B57] font-semibold dark:text-[#E8F1F5]',
    'C#': 'text-[#239120] font-semibold',
    'Kotlin': 'text-[#7F52FF] font-semibold',
    'Golang': 'text-[#00ADD8] font-semibold',
    'PHP': 'text-[#777BB4] font-semibold',

    // Frameworks & Libraries (Frontend)
    'React': 'text-[#61DAFB] font-semibold',
    'Next.js': 'text-black dark:text-white font-semibold',
    'NextJS': 'text-black dark:text-white font-semibold',
    'Redux': 'text-[#764ABC] font-semibold',
    'MUI': 'text-[#007FFF] font-semibold',
    'Material UI': 'text-[#007FFF] font-semibold',
    'shadcn': 'text-black dark:text-white font-semibold italic',
    'shadcn/ui': 'text-black dark:text-white font-semibold italic',
    'Tailwind CSS': 'text-[#38B2AC] font-semibold',
    'HTML': 'text-[#E34F26] font-semibold',

    // Frameworks & Libraries (Backend)
    'Node.js': 'text-[#339933] font-semibold',
    'NestJS': 'text-[#E0234E] font-semibold',
    'Express.js': 'text-black dark:text-white font-semibold',
    'TypeORM': 'text-[#fe0a4f] font-semibold',
    'Laravel': 'text-[#FF2D20] font-semibold',

    // Databases & Infrastructure
    'PostgreSQL': 'text-[#336791] font-semibold',
    'MongoDB': 'text-[#47A248] font-semibold',
    'Redis': 'text-[#DC382D] font-semibold',
    'Docker': 'text-[#2496ED] font-semibold',
    'Kubernetes': 'text-[#326CE5] font-semibold',
    'RabbitMQ': 'text-[#FF6600] font-semibold',
    'Grafana': 'text-[#F46800] font-semibold',
    'Prometheus': 'text-[#E6522C] font-semibold',
    'Meilisearch': 'text-[#FF5CAA] font-semibold',

    // Concepts & Tools
    'Git': 'text-[#F05032] font-semibold',
    'CI/CD': 'text-[#4c5e91] font-semibold',
    'SOLID': 'text-orange-500 font-semibold',
    'OOP': 'text-orange-500 font-semibold',
    'DDD': 'text-orange-500 font-semibold',
    'Clean Architecture': 'text-orange-500 font-semibold',
    'MVC': 'text-orange-500 font-semibold',
    'WebSocket': 'text-black dark:text-white font-semibold',
    'REST API': 'text-black dark:text-white font-semibold',
    'GraphQL': 'text-[#E10098] font-semibold',
};

interface ToolHighlighterProps {
    text: string;
    className?: string;
}

export const ToolHighlighter: React.FC<ToolHighlighterProps> = ({ text, className }) => {
    if (!text) return null;

    // Create a regex pattern that matches any of the tool names
    // We sort by length descending to match "React Native" before "React" if we had it
    const pattern = new RegExp(
        `(${Object.keys(toolsMap)
            .sort((a, b) => b.length - a.length)
            .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape special chars
            .join('|')})`,
        'g'
    );

    const parts = text.split(pattern);

    return (
        <span className={className}>
            {parts.map((part, index) => {
                // If the part matches a tool name, wrap it
                if (toolsMap[part]) {
                    return (
                        <span key={index} className={toolsMap[part]}>
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </span>
    );
};
