'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ResumePage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <header style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1>Хохлов Дмитрий</h1>
        <p>Frontend Developer (React)</p>
        <button onClick={() => setShowContact(!showContact)} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          {showContact ? 'Скрыть контакты' : 'Показать контакты'}
        </button>
        {showContact && (
          <div>
            <p>Телефон: +7 (932) 477-0975</p>
            <p>Email: hohlov.03@inbox.ru</p>
            <p>Telegram: @diametrfq</p>
          </div>
        )}
      </header>

      <table align="right">
        <tr>
          <th>      
            <div>
              <Image src="https://www.codewars.com/users/DiametrFQ/badges/small" alt='Codewars stats'/><br/>
              <Image src="https://streak-stats.demolab.com?user=DiametrFQ&theme=github-dark-blue&border_radius=6&card_width=300&type=png" alt="GitHub Streak"/><br/>
              <Image src="https://github-readme-stats.vercel.app/api/top-langs/?username=DiametrFQ&layout=donut-vertical" alt="GitHub Lengs"/><br/>
            </div>
          </th>
        </tr>
      </table>
      
      <section>
        <h2>Обо мне</h2>
        <p>
          Я опытный frontend разработчик с более чем четырехлетним опытом в создании
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
        <p>Все мои проекты вы можете оценить на <Link href="https://github.com/DiametrFQ" target="_blank">GitHub</Link>.</p>
      </section>
      
      <div>
        📫 Connect with me:<br/>
        <div className='flex'>
          <a href="https://t.me/diametrfq" target="_blank">
            <Image className='h-10' src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram link"/>
          </a>
          <a href="https://linkedin.com/in/diametrfq" target="_blank">
            <Image className='h-10' src="https://static-00.iconduck.com/assets.00/linkedin-icon-1024x1024-net2o24e.png" alt="LinkedIn link"/>
          </a>
          <a href="mailto:hohlov.03@inbox.ru" target="_blank">
            <Image className='h-10' src="https://cdn.pixabay.com/photo/2016/06/13/17/30/mail-1454731_1280.png" alt="email link"/>
          </a>
        </div>
      </div>
    </div>
  );
}
