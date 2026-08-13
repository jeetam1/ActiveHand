import React from 'react';

export default function AboutUsPage({ onNavigate }) {
  return (
    <div style={{ padding: '70px 24px 100px', maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ color: '#DF5E30', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
          How we're using craft to empower people, elevate spirits
        </p>
        <h1 style={{ color: '#00676A', fontSize: '3rem', fontWeight: 800, marginBottom: 24, fontFamily: 'Outfit, sans-serif' }}>
          Our Story
        </h1>
        <blockquote style={{ fontStyle: 'italic', fontSize: '1.25rem', color: '#DF5E30', fontWeight: 600, maxWidth: 700, margin: '0 auto 32px' }}>
          "Craft plays an indispensable role in our cultural, environmental, emotional and spiritual well-being."
        </blockquote>
      </div>

      <div style={{ color: '#4A5568', fontSize: '1.1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 60 }}>
        <p>
          Active Hands was founded in 2015 by Vineeta Nahar and Sonika Deoda who equally share the vision that craft plays an indispensable role in our cultural, environmental, emotional and spiritual well-being. With our involvement with NGOs, municipal schools, visually challenged schools and teaching core crafts to children from all spectrums, we could see how craft is not just a means of vocational training but is therapeutic and a great means for interdisciplinary learning too.
        </p>
        <p>
          While our children were growing, we found that all the so-called art and craft options available were mere cut, paste and colour activities that could only keep the child engaged for some time but does not contribute to any meaningful growth. Most parents, with their busy schedules and over-competitive schooling environment, fail to recognise the need for mental rejuvenation.
        </p>
        <p>
          Our immense passion for craft and compassion for our future generation put us on a journey of researching and relearning how our craft tradition can be contemporised and packed in accessible DIY kit form.
        </p>
      </div>

      {/* Team Section */}
      <h2 style={{ color: '#00676A', fontSize: '2.2rem', fontWeight: 800, textAlign: 'center', marginBottom: 36, fontFamily: 'Outfit, sans-serif' }}>
        Meet Our Founders
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        <div style={{ background: '#FAF8F5', border: '1px solid #E8E2D9', borderRadius: 12, padding: '30px 24px' }}>
          <h3 style={{ color: '#DF5E30', fontSize: '1.4rem', fontWeight: 700 }}>Vineeta Nahar</h3>
          <p style={{ color: '#00676A', fontWeight: 600, fontSize: '0.95rem', marginBottom: 12 }}>Founder & Design Head</p>
          <p style={{ color: '#4A5568', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Apparel designer with over 20 years of experience ranging from textile, apparel to craft training. She drives design, research, marketing, and creative training.
          </p>
        </div>

        <div style={{ background: '#FAF8F5', border: '1px solid #E8E2D9', borderRadius: 12, padding: '30px 24px' }}>
          <h3 style={{ color: '#DF5E30', fontSize: '1.4rem', fontWeight: 700 }}>Sonika Deoda</h3>
          <p style={{ color: '#00676A', fontWeight: 600, fontSize: '0.95rem', marginBottom: 12 }}>Co-Founder & Operations</p>
          <p style={{ color: '#4A5568', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Professionally trained in finance and audit with extensive knowledge of diverse craft mediums. She oversees production, operations, and customer relations.
          </p>
        </div>
      </div>
    </div>
  );
}
