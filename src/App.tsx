import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [data, setData] = useState({
    headline: 'Descubra Como Mudar de Vida Hoje',
    subheadline: 'O método definitivo para alcançar seus objetivos mais rápido que a luz, sem segredos mirabolantes.',
    bgColor: '#000000',
    primaryColor: '#6366f1',
    btnText: 'Quero Garantir Minha Vaga',
    checkoutLink: 'https://pay.kiwify.com.br/xxxxx',
    benefits: 'Acesso vitalício\nSuporte 24/7\nAtualizações constantes',
    extraTitle: 'Por que escolher este método?',
    extraDescription: 'Este método foi testado por milhares de pessoas que buscavam resultados rápidos e duradouros. Sem enrolação.',
    pricingTitle: 'Escolha o seu Plano',
    plan1Name: 'Iniciante', plan1Price: '97', plan1Features: 'Acesso 1 Ano, Suporte Básico',
    plan2Name: 'Diamond', plan2Price: '297', plan2Features: 'Acesso Vitalício, Suporte VIP, Bônus Exclusivos',
    logos: 'Hotmart, Kiwify, Google, Facebook',
    step1Title: 'Inscrição', step1Desc: 'Faça sua inscrição rápida e segura.',
    step2Title: 'Acesso', step2Desc: 'Receba os dados no seu e-mail imediatamente.',
    step3Title: 'Prática', step3Desc: 'Aplique o método e veja os resultados.',
    faq: 'Como recebo o acesso?:O acesso é enviado para o seu e-mail logo após a confirmação do pagamento.\nTem garantia?:Sim, você tem 7 dias de garantia incondicional.'
  });

  const [apiKey, setApiKey] = useState('');
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);

  // Carregar a apiKey do localStorage ao iniciar
  useState(() => {
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') : '';
    if (savedKey) {
      setApiKey(savedKey);
    }
  });

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  }

  const handleGenerateIA = async () => {
    if (!apiKey) {
      alert("Por favor, insira sua OpenAI API Key no campo abaixo para usar a IA.");
      return;
    }

    const produto = prompt("Sobre o que é o seu produto? (Ex: Curso de Guitarra para Iniciantes)");
    if (!produto) return;

    setIsGeneratingIA(true);
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ 
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em Landing Pages de alta conversão. Gere uma Headline matadora, Subheadline, 3 passos do método e 2 perguntas de FAQ.'
            },
            {
              role: 'user',
              content: `Produto: ${produto}. Responda apenas em formato JSON: {"headline": "...", "subheadline": "...", "step1Title": "...", "step1Desc": "...", "step2Title": "...", "step2Desc": "...", "step3Title": "...", "step3Desc": "...", "faq": "Pergunta:Resposta\\nPergunta:Resposta"}`
            }
          ]
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Erro na IA');

      const content = JSON.parse(json.choices[0].message.content);
      setData(prev => ({ ...prev, ...content }));
      alert("Mágica IA aplicada com sucesso!");
    } catch (err: any) {
      alert("Erro ao gerar com IA: " + err.message);
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const handleChange = (e: any) => setData({ ...data, [e.target.name]: e.target.value });

  const generateZip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const zip = new JSZip();

      // Components HTML
      const logosHTML = data.logos.split(',').map(l => `<span>${l.trim()}</span>`).join('');
      
      const benefitsHTML = data.benefits.split('\n')
        .map(b => b.trim())
        .filter(b => b !== '')
        .map(b => `<li><span class="check">✓</span>${b}</li>`)
        .join('');

      const faqHTML = data.faq.split('\n')
        .filter(line => line.includes(':'))
        .map(line => {
          const [q, a] = line.split(':');
          return `<div class="faq-item"><span class="faq-q">${q}</span><p class="faq-a">${a}</p></div>`;
        }).join('');

      const renderPricingCard = (name: string, price: string, features: string) => `
        <div class="price-card">
          <h4>${name}</h4>
          <div class="amount">R$ ${price}</div>
          <ul>${features.split(',').map(f => `<li>✓ ${f.trim()}</li>`).join('')}</ul>
          <a href="${data.checkoutLink}" class="cta-btn" style="padding: 15px; font-size: 1rem;">Selecionar</a>
        </div>
      `;

      const pricingHTML = renderPricingCard(data.plan1Name, data.plan1Price, data.plan1Features) + 
                          renderPricingCard(data.plan2Name, data.plan2Price, data.plan2Features);

      // HTML Template
      const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.headline}</title>
  <style>
    :root { --bg: ${data.bgColor}; --primary: ${data.primaryColor}; --text: #ffffff; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: sans-serif; background-color: var(--bg); color: var(--text); line-height: 1.5; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; text-align: center; }
    .attention-badge { display: inline-block; background: rgba(255,0,0,0.1); color: #ff3333; border: 1px solid #ff3333; padding: 5px 15px; border-radius: 50px; font-weight: 700; font-size: 0.9rem; margin-bottom: 20px; text-transform: uppercase; }
    h1 { font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 20px; }
    .subtitle { font-size: 1.3rem; color: #a1a1aa; margin-bottom: 40px; }
    .video-placeholder { width: 100%; aspect-ratio: 16/9; background: #18181b; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #52525b; border: 2px dashed #27272a; margin-bottom: 40px; }
    .cta-btn { display: inline-block; width: 100%; background-color: var(--primary); color: #fff; padding: 24px; border-radius: 12px; font-size: 1.5rem; font-weight: 900; text-decoration: none; text-transform: uppercase; transition: transform 0.2s; box-shadow: 0 10px 30px -10px var(--primary); text-align: center; }
    .cta-btn:hover { transform: translateY(-3px); opacity: 0.9; }
    
    .logo-bar { display: flex; justify-content: center; gap: 40px; opacity: 0.4; filter: grayscale(1); margin: 60px 0; flex-wrap: wrap; }
    .logo-bar span { font-weight: 900; font-size: 1.2rem; }

    .benefits-box { background: #18181b; border-radius: 16px; padding: 30px; text-align: left; border: 1px solid #27272a; margin: 60px 0; }
    .benefits-box h3 { margin-bottom: 20px; font-size: 1.5rem; text-align: center;}
    .benefits-box ul { list-style: none; }
    .benefits-box li { margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; }
    .check { color: #10b981; font-weight: bold; margin-right: 15px; font-size: 1.3rem; }

    .steps-grid { display: flex; gap: 20px; margin: 60px 0; }
    .step-card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 25px; flex: 1; text-align: center; }
    .step-num { width: 40px; height: 40px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-weight: 900; }
    
    .pricing-grid { display: flex; gap: 20px; margin-top: 40px; justify-content: center; }
    .price-card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 30px; flex: 1; max-width: 380px; text-align: center; }
    .price-card h4 { color: #a1a1aa; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 10px; }
    .price-card .amount { font-size: 2.5rem; font-weight: 900; margin-bottom: 20px; color: #fff; }
    .price-card ul { list-style: none; padding: 0; text-align: left; margin-bottom: 25px; font-size: 0.9rem; }
    .price-card li { margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }

    .faq-list { text-align: left; max-width: 700px; margin: 60px auto; }
    .faq-item { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 15px; }
    .faq-q { font-weight: 900; color: #fff; margin-bottom: 8px; display: block; font-size: 1.1rem; }
    .faq-a { color: #a1a1aa; line-height: 1.6; }

    .extra-section { margin: 80px 0; text-align: left; }
    .extra-section h2 { font-size: 2.5rem; margin-bottom: 20px; }
    .extra-section p { color: #a1a1aa; line-height: 1.8; font-size: 1.2rem; }

    @media (max-width: 768px) {
      .pricing-grid, .steps-grid { flex-direction: column; align-items: center; }
      .price-card, .step-card { width: 100%; }
      h1 { font-size: 2.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="attention-badge">Oferta Especial Ativa</div>
    <h1>${data.headline}</h1>
    <p class="subtitle">${data.subheadline}</p>
    <div class="video-placeholder"><p>🎥 Seu Vídeo de Vendas Aqui</p></div>
    <a href="${data.checkoutLink}" class="cta-btn" target="_blank">${data.btnText}</a>
    
    <div class="logo-bar">${logosHTML}</div>

    <div class="extra-section">
      <h2>${data.extraTitle}</h2>
      <p>${data.extraDescription}</p>
    </div>

    <div style="margin: 80px 0;">
      <h2 style="font-size: 2.5rem; margin-bottom: 40px;">Como Funciona o Método</h2>
      <div class="steps-grid">
        <div class="step-card"><div class="step-num">1</div><h5>${data.step1Title}</h5><p>${data.step1Desc}</p></div>
        <div class="step-card"><div class="step-num">2</div><h5>${data.step2Title}</h5><p>${data.step2Desc}</p></div>
        <div class="step-card"><div class="step-num">3</div><h5>${data.step3Title}</h5><p>${data.step3Desc}</p></div>
      </div>
    </div>

    <div class="benefits-box">
      <h3>Você terá acesso imediato a:</h3>
      <ul>${benefitsHTML}</ul>
    </div>

    <div style="margin: 80px 0;">
      <h2 style="font-size: 2.5rem; margin-bottom: 40px;">${data.pricingTitle}</h2>
      <div class="pricing-grid">${pricingHTML}</div>
    </div>

    <div style="margin: 80px 0;">
      <h2 style="font-size: 2.3rem; margin-bottom: 30px;">Dúvidas Frequentes</h2>
      <div class="faq-list">${faqHTML}</div>
    </div>

    <div style="margin-top: 80px; background: #18181b; padding: 60px; border-radius: 20px; border: 1px solid #27272a;">
      <h2 style="font-size: 2.2rem; margin-bottom: 20px;">Pronto para a transformação?</h2>
      <a href="${data.checkoutLink}" class="cta-btn" target="_blank">${data.btnText}</a>
    </div>

    <footer style="margin-top: 100px; padding: 40px; color: #71717a; border-top: 1px solid #27272a;">
      <p>© 2026 - Todos os Direitos Reservados</p>
    </footer>
  </div>
</body>
</html>`;

      zip.file("index.html", htmlContent);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "sales-page-pro.zip");
      alert("Landing Page 2.0 (Lovable Style) gerada com sucesso!");
    } catch (error) {
      alert('Erro ao gerar o arquivo.');
    }
  };



  return (
    <div className="app-container">
      {/* Editor Lateral */}
      <aside className="editor-sidebar">
        <span className="badge">No-Code Sales Factory 2.0</span>
        <h1>Design Estratégico</h1>

        <form onSubmit={generateZip}>
          {/* AI MAGIC BAR */}
          <div className="form-group" style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ color: '#a855f7', fontWeight: 'bold', margin: 0 }}>Mágica IA (Habilitada)</label>
              <button type="button" onClick={handleGenerateIA} className="btn-ia-magic" disabled={isGeneratingIA} style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isGeneratingIA ? 'Gerando...' : '✨ Gerar Copy Completa'}
              </button>
            </div>
            <input type="password" className="form-input" placeholder="Sua OpenAI Key..." value={apiKey} onChange={handleApiKeyChange} />
          </div>

          {/* SECTION: HERO */}
          <div className="editor-section">
            <h3 className="section-label">1. Hero Section (Início)</h3>
            <div className="form-group">
              <label>Headline Impactante</label>
              <input type="text" name="headline" className="form-input" value={data.headline} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Subheadline persuasiva</label>
              <textarea name="subheadline" className="form-input textarea" value={data.subheadline} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Logotipos Autoridade (separados por vírgula)</label>
              <input type="text" name="logos" className="form-input" value={data.logos} onChange={handleChange} />
            </div>
          </div>

          {/* SECTION: PROCESS */}
          <div className="editor-section">
            <h3 className="section-label">2. Como Funciona (3 Passos)</h3>
            {[1, 2, 3].map(num => (
              <div key={num} className="form-row" style={{marginBottom: '15px'}}>
                <input type="text" name={`step${num}Title`} className="form-input" placeholder={`Título Passo ${num}`} value={(data as any)[`step${num}Title`]} onChange={handleChange} />
                <input type="text" name={`step${num}Desc`} className="form-input" placeholder={`Descrição Passo ${num}`} value={(data as any)[`step${num}Desc`]} onChange={handleChange} style={{marginTop:'5px'}} />
              </div>
            ))}
          </div>

          {/* SECTION: PRICING */}
          <div className="editor-section">
            <h3 className="section-label">3. Oferta e Planos</h3>
            <div className="form-group">
              <input type="text" name="pricingTitle" className="form-input" placeholder="Título da Oferta" value={data.pricingTitle} onChange={handleChange} />
            </div>
            <div className="row">
              <div className="col form-group">
                <label>Plano A</label>
                <input type="text" name="plan1Name" className="form-input" placeholder="Nome" value={data.plan1Name} onChange={handleChange} />
                <input type="text" name="plan1Price" className="form-input" placeholder="R$" value={data.plan1Price} onChange={handleChange} />
              </div>
              <div className="col form-group">
                <label>Plano B</label>
                <input type="text" name="plan2Name" className="form-input" placeholder="Nome" value={data.plan2Name} onChange={handleChange} />
                <input type="text" name="plan2Price" className="form-input" placeholder="R$" value={data.plan2Price} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION: FAQ */}
          <div className="editor-section">
            <h3 className="section-label">4. FAQ (Matar Objeções)</h3>
            <label style={{fontSize:'0.7rem', color:'#71717a'}}>Formato: Pergunta:Resposta (Uma por linha)</label>
            <textarea name="faq" className="form-input textarea" value={data.faq} onChange={handleChange} />
          </div>

          {/* CONFIG */}
          <div className="editor-section">
            <h3 className="section-label">5. Cores e Checkout</h3>
            <div className="row">
              <div className="col"><input type="color" name="bgColor" className="form-input" value={data.bgColor} onChange={handleChange} /></div>
              <div className="col"><input type="color" name="primaryColor" className="form-input" value={data.primaryColor} onChange={handleChange} /></div>
            </div>
            <input type="url" name="checkoutLink" className="form-input" placeholder="Link do Checkoot" value={data.checkoutLink} onChange={handleChange} style={{marginTop:'10px'}} />
          </div>

          <button type="submit" className="btn" style={{marginTop:'20px'}}>⚡ Gerar Página Completa 2.0</button>
        </form>
      </aside>

      {/* Canvas de Preview */}
      <main className="preview-canvas">
        <div className="preview-window">
          <div style={{ backgroundColor: data.bgColor, color: '#fff', padding: '60px 40px', textAlign: 'center', minHeight:'100%' }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,0,0,0.1)', color: '#ff3333', border: '1px solid #ff3333', padding: '5px 15px', borderRadius: '50px', fontWeight: 700, fontSize: '0.7rem', marginBottom: '20px' }}>OFERTA EXCLUSIVA</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>{data.headline}</h1>
            <p style={{ fontSize: '1.1rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto 40px' }}>{data.subheadline}</p>
            
            <div style={{ width: '100%', height: '300px', background: '#18181b', borderRadius: '12px', margin: '0 auto 40px', border: '2px dashed #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}>Vídeo de Vendas</div>

            <div className="logo-bar" style={{display:'flex', justifyContent:'center', gap:'20px', opacity:0.5, marginBottom:'60px'}}>
              {data.logos.split(',').map((l, i) => <span key={i} style={{fontSize:'0.8rem', fontWeight:'900'}}>{l.trim()}</span>)}
            </div>

            {/* How it Works Preview */}
            <div style={{margin: '60px 0'}}>
              <h2 style={{fontSize:'1.8rem', marginBottom:'30px'}}>Como Funciona</h2>
              <div className="steps-grid" style={{display:'flex', gap:'15px'}}>
                {[1, 2, 3].map(n => (
                  <div key={n} className="step-card" style={{background:'#18181b', padding:'15px', borderRadius:'12px', flex:1}}>
                    <div className="step-num" style={{background: data.primaryColor, width:'30px', height:'30px', borderRadius:'50%', margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center'}}>{n}</div>
                    <h5 style={{fontSize:'0.9rem'}}>{(data as any)[`step${n}Title`]}</h5>
                    <p style={{fontSize:'0.75rem', color:'#71717a'}}>{(data as any)[`step${n}Desc`]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Preview */}
            <div style={{ marginTop: '60px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '30px' }}>{data.pricingTitle}</h2>
              <div className="pricing-grid" style={{display:'flex', gap:'15px'}}>
                <div className="price-card" style={{background:'#18181b', padding:'20px', borderRadius:'12px', flex:1}}>
                  <h4 style={{fontSize:'0.7rem', color:'#71717a'}}>{data.plan1Name}</h4>
                  <div style={{fontSize:'1.8rem', fontWeight:900}}>R$ {data.plan1Price}</div>
                </div>
                <div className="price-card" style={{background:'#18181b', padding:'20px', borderRadius:'12px', flex:1, border:`1px solid ${data.primaryColor}`}}>
                  <h4 style={{fontSize:'0.7rem', color:'#71717a'}}>{data.plan2Name}</h4>
                  <div style={{fontSize:'1.8rem', fontWeight:900}}>R$ {data.plan2Price}</div>
                </div>
              </div>
            </div>

            {/* FAQ Preview */}
            <div style={{ marginTop: '60px', textAlign: 'left', maxWidth: '600px', margin: '60px auto' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', textAlign:'center' }}>FAQ</h2>
              <div className="faq-list">
                {data.faq.split('\n').filter(l => l.includes(':')).map((l, i) => {
                  const [q, a] = l.split(':');
                  return (
                    <div key={i} className="faq-item" style={{background:'#18181b', padding:'15px', borderRadius:'8px', marginBottom:'10px'}}>
                      <span style={{fontWeight:'bold', fontSize:'0.9rem'}}>{q}</span>
                      <p style={{fontSize:'0.8rem', color:'#71717a', marginTop:'5px'}}>{a}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{marginTop:'80px', padding:'40px', background:'#18181b', borderRadius:'20px', border:`1px solid ${data.primaryColor}`}}>
              <h3 style={{fontSize:'1.5rem', marginBottom:'20px'}}>Última chance de mudar tudo.</h3>
              <div style={{background: data.primaryColor, padding:'15px', borderRadius:'10px', fontWeight:900}}>{data.btnText}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
