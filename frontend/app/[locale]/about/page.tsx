'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function ResumePage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className={styles.container}> 
      <header className={styles.header}>
        <h1>Хохлов Дмитрий</h1>
        <p>FullStack Developer (TypeScript, Rust)</p>
        <button onClick={() => setShowContact(!showContact)} className={styles.contactButton}>
          {showContact ? 'Скрыть контакты' : 'Показать контакты'}
        </button>
        {showContact && (
          <div className={styles.contactDetails}>
            <p>Телефон: +7 (932) 477-0975</p>
            <p>Email: hohlov.03@inbox.ru</p>
            <p>Telegram: @diametrfq</p>
          </div>
        )}
      </header>

      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          <section>
            <h2>Обо мне</h2>
            <p>
              Я опытный FullStack разработчик с более чем четырехлетним опытом в создании
              эффективных веб-приложений. Мои навыки охватывают весь цикл разработки, от концепции и дизайна до реализации и поддержки.
            </p>
            <p>
              Активно следую за последними тенденциями веб-разработки, увлечен созданием чистого, эффективного и масштабируемого кода.
            </p>
          </section>

          <section>
            <h2>Опыт работы</h2>
            <p><strong>Junior FullStack Developer</strong> – Cyberia (апрель 2024 - настоящее время)</p>
            <p>Дорабатываю разные штуки.</p>
          </section>

          <section>
            <h2>Образование</h2>
            <p><strong>РТУ МИРЭА</strong> (2025) – Институт кибербезопасности и цифровых технологий, Информационные системы и технологии</p>
          </section>

          <section>
            <h2>Навыки</h2>
            <p>TypeScript, JavaScript, React, Git, Node.js, HTML5, CSS3, SOLID, Redux, ООП, SCSS, BEM</p>
          </section>

          <section>
            <h2>Проекты</h2>
            <p>Все мои проекты вы можете оценить на <Link href="https://github.com/DiametrFQ" target="_blank" className={styles.link}>GitHub</Link>.</p>
          </section>
        </main>
        
        <aside className={styles.sidebar}>
          <div className={styles.statsImages}>
            <Image src="https://www.codewars.com/users/DiametrFQ/badges/small" width={300} height={54} alt='Codewars stats' unoptimized/>
            <Image src="https://streak-stats.demolab.com?user=DiametrFQ&theme=github-dark-blue&border_radius=6&card_width=300&type=png" width={300} height={150} alt="GitHub Streak" unoptimized/>
            <Image src="https://github-readme-stats.vercel.app/api/top-langs/?username=DiametrFQ&layout=donut-vertical&theme=tokyonight" width={300} height={450} alt="GitHub Lengs" unoptimized />
          </div>
        </aside>
      </div>
    </div>
  );
}