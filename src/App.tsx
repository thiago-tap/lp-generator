import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';

function App() {
  const [data, setData] = useState({
    headline: 'Descubra Como Mudar de Vida Hoje',
    subheadline: 'O método definitivo para alcançar seus objetivos mais rápido que a luz, sem segredos mirabolantes.',
    bgColor: '#000000',
    primaryColor: '#f43f5e',
    btnText: 'Quero Garantir Minha Vaga',
    checkoutLink: 'https://pay.kiwify.com.br/xxxxx',
    benefits: 'Acesso vitalício\nSuporte 24/7\nAtualizações constantes',
    extraTitle: 'Por que escolher este método?',
    extraDescription: 'Este método foi testado por milhares de pessoas que buscavam resultados rápidos e duradouros. Sem enrolação.',
    pricingTitle: 'Escolha o seu Plano',
    plan1Name: 'Iniciante', plan1Price: '97', plan1Features: 'Acesso 1 Ano, Suporte Básico',
    plan2Name: 'Diamond', plan2Price: '297', plan2Features: 'Acesso Vitalício, Suporte VIP, Bônus Exclusivos'
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
              content: 'Você é um especialista em Landing Pages de alta conversão. Gere uma Headline matadora (curta e impactante) e uma Subheadline persuasiva.'
            },
            {
              role: 'user',
              content: `Produto: ${produto}. Responda apenas em formato JSON: {"headline": "...", "subheadline": "..."}`
            }
          ]
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Erro na IA');

      const content = JSON.parse(json.choices[0].message.content);
      setData(prev => ({ ...prev, ...content }));
      alert("IA gerou sua Headline e Subheadline com sucesso!");
    } catch (err: any) {
      alert("Erro ao gerar com IA: " + err.message);
    } finally {
      setIsGeneratingIA(false);
    }
  };

  const handleChange = (e: any) => setData({ ...data, [e.target.name]: e.target.value });

  const generateZip = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando geração de ZIP...', data);
    
    try {
      const zip = new JSZip();

      // Benefits HTML
      const benefitsHTML = data.benefits.split('\n')
        .map(b => b.trim())
        .filter(b => b !== '')
        .map(b => `<li><span class="check">✓</span>${b}</li>`)
        .join('');

      // Pricing HTML
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
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; text-align: center; }
    .attention-badge { display: inline-block; background: rgba(255,0,0,0.1); color: #ff3333; border: 1px solid #ff3333; padding: 5px 15px; border-radius: 50px; font-weight: 700; font-size: 0.9rem; margin-bottom: 20px; text-transform: uppercase; }
    h1 { font-size: 3rem; font-weight: 900; line-height: 1.1; margin-bottom: 20px; }
    .subtitle { font-size: 1.25rem; color: #a1a1aa; margin-bottom: 40px; }
    .video-placeholder { width: 100%; aspect-ratio: 16/9; background: #18181b; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #52525b; border: 2px dashed #27272a; margin-bottom: 40px; }
    .cta-btn { display: inline-block; width: 100%; background-color: var(--primary); color: #fff; padding: 24px; border-radius: 12px; font-size: 1.5rem; font-weight: 900; text-decoration: none; text-transform: uppercase; transition: transform 0.2s; box-shadow: 0 10px 30px -10px var(--primary); text-align: center; }
    .cta-btn:hover { transform: translateY(-3px); }
    .secure { font-size: 0.9rem; color: #71717a; margin-top: 15px; margin-bottom: 40px; }
    .benefits-box { background: #18181b; border-radius: 16px; padding: 30px; text-align: left; border: 1px solid #27272a; margin-bottom: 60px; }
    .benefits-box h3 { margin-bottom: 20px; font-size: 1.5rem; text-align: center;}
    .benefits-box ul { list-style: none; }
    .benefits-box li { margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; }
    .check { color: #10b981; font-weight: bold; margin-right: 15px; font-size: 1.3rem; }
    
    /* Pricing */
    .pricing-grid { display: flex; gap: 20px; margin-top: 40px; justify-content: center; }
    .price-card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 30px; flex: 1; max-width: 350px; text-align: center; }
    .price-card h4 { color: #a1a1aa; font-size: 0.9rem; text-transform: uppercase; margin-bottom: 10px; }
    .price-card .amount { font-size: 2rem; font-weight: 900; margin-bottom: 20px; color: #fff; }
    .price-card ul { list-style: none; padding: 0; text-align: left; margin-bottom: 25px; }
    .price-card li { font-size: 0.85rem; color: #d4d4d8; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
    
    .extra-section { margin-top: 80px; padding-top: 60px; border-top: 1px solid #27272a; text-align: left; }
    .extra-section h2 { font-size: 2.2rem; margin-bottom: 20px; }
    .extra-section p { color: #a1a1aa; line-height: 1.8; font-size: 1.1rem; }

    @media (max-width: 600px) {
      .pricing-grid { flex-direction: column; align-items: center; }
      .price-card { width: 100%; }
      h1 { font-size: 2.2rem; }
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="container">
      <div class="attention-badge">Atenção! Oferta por Tempo Limitado</div>
      <h1>${data.headline}</h1>
      <p class="subtitle">${data.subheadline}</p>
      <div class="video-placeholder"><p>Seu Vídeo Aqui</p></div>
      <a href="${data.checkoutLink}" class="cta-btn" target="_blank">${data.btnText}</a>
      <p class="secure">🔒 Compra 100% Segura. Acesso imediato.</p>
      
      <div class="benefits-box">
        <h3>O que você vai receber:</h3>
        <ul>${benefitsHTML}</ul>
      </div>

      <div class="extra-section">
        <h2>${data.extraTitle}</h2>
        <p>${data.extraDescription}</p>
      </div>

      <div style="margin-top: 80px;">
        <h2 style="font-size: 2.5rem; margin-bottom: 40px;">${data.pricingTitle}</h2>
        <div class="pricing-grid">${pricingHTML}</div>
      </div>

      <footer style="margin-top: 100px; padding: 40px; color: #71717a; border-top: 1px solid #27272a;">
        <p>© 2026 - Todos os Direitos Reservados</p>
      </footer>
    </div>
  </div>
</body>
</html>`;

      zip.file("index.html", htmlContent);
      
      console.log('Gerando blob...');
      const content = await zip.generateAsync({ type: "blob" });
      
      console.log('Disparando download...');
      saveAs(content, "landing-page.zip");
      
      alert("Landing Page Profissional gerada com sucesso!");
    } catch (error) {
      console.error('Erro na geração do ZIP:', error);
      alert('Erro ao gerar o arquivo.');
    }
  };

  const benefitsList = data.benefits.split('\n').filter(b => b.trim() !== '');

  return (
    <div className="app-container">
      {/* Editor Lateral */}
      <aside className="editor-sidebar">
        <span className="badge">No-Code Editor PRO</span>
        <h1>Design da LP</h1>

        <form onSubmit={generateZip}>
          {/* API KEY SECTION */}
          <div className="form-group" style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '15px', borderRadius: '12px', border: '1px dashed rgba(168, 85, 247, 0.3)', marginBottom: '20px' }}>
            <label style={{ color: '#a855f7', fontWeight: 'bold' }}>Sua OpenAI API Key (BYOK)</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="sk-proj-..." 
              value={apiKey} 
              onChange={handleApiKeyChange} 
            />
          </div>

          {/* MAIN SECTION */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#6366f1', marginBottom: '15px', textTransform: 'uppercase' }}>Seção Principal</h3>
            
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Headline</label>
                <button type="button" onClick={handleGenerateIA} className="btn-ia-magic" disabled={isGeneratingIA} style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  {isGeneratingIA ? '...' : '✨ IA'}
                </button>
              </div>
              <input type="text" name="headline" className="form-input" value={data.headline} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Subheadline / Apoio</label>
              <textarea name="subheadline" className="form-input textarea" value={data.subheadline} onChange={handleChange} required />
            </div>
          </div>

          {/* PRICING SECTION */}
          <div style={{ marginBottom: '30px', borderTop: '1px solid #27272a', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#6366f1', marginBottom: '15px', textTransform: 'uppercase' }}>Tabela de Preços</h3>
            
            <div className="form-group">
              <label>Título da Tabela de Preços</label>
              <input type="text" name="pricingTitle" className="form-input" value={data.pricingTitle} onChange={handleChange} required />
            </div>

            <div className="row">
              <div className="col form-group">
                <label>Plano 1</label>
                <input type="text" name="plan1Name" className="form-input" placeholder="Nome" value={data.plan1Name} onChange={handleChange} />
                <input type="text" name="plan1Price" className="form-input" style={{marginTop:'5px'}} placeholder="Preço" value={data.plan1Price} onChange={handleChange} />
                <input type="text" name="plan1Features" className="form-input" style={{marginTop:'5px'}} placeholder="Vantagens (virgula)" value={data.plan1Features} onChange={handleChange} />
              </div>
              <div className="col form-group">
                <label>Plano 2</label>
                <input type="text" name="plan2Name" className="form-input" placeholder="Nome" value={data.plan2Name} onChange={handleChange} />
                <input type="text" name="plan2Price" className="form-input" style={{marginTop:'5px'}} placeholder="Preço" value={data.plan2Price} onChange={handleChange} />
                <input type="text" name="plan2Features" className="form-input" style={{marginTop:'5px'}} placeholder="Vantagens (virgula)" value={data.plan2Features} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* EXTRA SECTION */}
          <div style={{ marginBottom: '30px', borderTop: '1px solid #27272a', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#6366f1', marginBottom: '15px', textTransform: 'uppercase' }}>Conteúdo Extra</h3>
            
            <div className="form-group">
              <label>Título da Seção Extra</label>
              <input type="text" name="extraTitle" className="form-input" value={data.extraTitle} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Descrição Detalhada</label>
              <textarea name="extraDescription" className="form-input textarea" value={data.extraDescription} onChange={handleChange} required />
            </div>
          </div>

          {/* COLORS & CONFIG */}
          <div style={{ marginBottom: '30px', borderTop: '1px solid #27272a', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#6366f1', marginBottom: '15px', textTransform: 'uppercase' }}>Cores e Links</h3>

            <div className="row">
              <div className="col form-group">
                <label>Cor Fundo</label>
                <input type="color" name="bgColor" className="form-input" style={{height:'35px', padding:'2px'}} value={data.bgColor} onChange={handleChange} />
              </div>
              <div className="col form-group">
                <label>Cor Botão</label>
                <input type="color" name="primaryColor" className="form-input" style={{height:'35px', padding:'2px'}} value={data.primaryColor} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Texto Botão</label>
              <input type="text" name="btnText" className="form-input" value={data.btnText} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Link Checkout</label>
              <input type="url" name="checkoutLink" className="form-input" value={data.checkoutLink} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Benefícios (Resumo)</label>
              <textarea name="benefits" className="form-input textarea" value={data.benefits} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn">⚡ Baixar Landing Page Profissional</button>
        </form>
      </aside>

      {/* Canvas de Preview */}
      <main className="preview-canvas">
        <div className="preview-window">
          {/* Mini-simulação da LP Real */}
          <div style={{ backgroundColor: data.bgColor, minHeight: '600px', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255,0,0,0.1)', color: '#ff3333', border: '1px solid #ff3333', padding: '5px 15px', borderRadius: '50px', fontWeight: 700, fontSize: '0.8rem', marginBottom: '20px', textTransform: 'uppercase' }}>
              Atenção! Oferta por Tempo Limitado
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px', color: '#fff' }}>{data.headline}</h1>
            <p style={{ fontSize: '1.1rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto 40px' }}>{data.subheadline}</p>
            
            <div style={{ width: '100%', maxWidth: '500px', height: '280px', background: '#18181b', borderRadius: '12px', margin: '0 auto 40px', border: '2px dashed #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}>
              Vídeo de Vendas
            </div>

            <div style={{ display: 'inline-block', width: '100%', maxWidth: '500px', backgroundColor: data.primaryColor, color: '#fff', padding: '20px', borderRadius: '12px', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', boxShadow: `0 10px 30px -10px ${data.primaryColor}` }}>
              {data.btnText}
            </div>
            
            <p style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '15px', marginBottom: '40px' }}>🔒 Compra 100% Segura.</p>

            <div style={{ background: '#18181b', borderRadius: '16px', padding: '30px', textAlign: 'left', border: '1px solid #27272a', maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Você vai receber:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {benefitsList.map((b, i) => (
                  <li key={i} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', fontSize:'0.9rem' }}>
                    <span style={{ color: '#10b981', marginRight: '10px' }}>✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview Extra Section */}
            <div className="section-extra" style={{ textAlign: 'left', maxWidth: '600px', margin: '60px auto' }}>
              <h2 style={{fontSize: '1.8rem'}}>{data.extraTitle}</h2>
              <p style={{fontSize: '0.95rem', color: '#a1a1aa'}}>{data.extraDescription}</p>
            </div>

            {/* Preview Pricing Table */}
            <div style={{ marginTop: '60px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '30px' }}>{data.pricingTitle}</h2>
              <div className="pricing-grid">
                <div className="price-card">
                  <h4>{data.plan1Name}</h4>
                  <div className="amount">R$ {data.plan1Price}</div>
                  <ul>{data.plan1Features.split(',').map((f, i) => <li key={i}>✓ {f.trim()}</li>)}</ul>
                </div>
                <div className="price-card" style={{borderColor: data.primaryColor}}>
                  <h4>{data.plan2Name}</h4>
                  <div className="amount">R$ {data.plan2Price}</div>
                  <ul>{data.plan2Features.split(',').map((f, i) => <li key={i}>✓ {f.trim()}</li>)}</ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
