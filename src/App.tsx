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
    benefits: 'Acesso vitalício\nSuporte 24/7\nAtualizações constantes'
  });

  const handleChange = (e: any) => setData({ ...data, [e.target.name]: e.target.value });

  const generateZip = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando geração de ZIP...', data);
    
    try {
      const zip = new JSZip();

      // Generate Array of Benefits
      const benefitsHTML = data.benefits.split('\n')
        .map(b => b.trim())
        .filter(b => b !== '')
        .map(b => `<li><span class="check">✓</span>${b}</li>`)
        .join('');

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
    .cta-btn { display: inline-block; width: 100%; background-color: var(--primary); color: #fff; padding: 24px; border-radius: 12px; font-size: 1.5rem; font-weight: 900; text-decoration: none; text-transform: uppercase; transition: transform 0.2s; box-shadow: 0 10px 30px -10px var(--primary); }
    .cta-btn:hover { transform: translateY(-3px); }
    .secure { font-size: 0.9rem; color: #71717a; margin-top: 15px; margin-bottom: 40px; }
    .benefits-box { background: #18181b; border-radius: 16px; padding: 30px; text-align: left; border: 1px solid #27272a; }
    .benefits-box h3 { margin-bottom: 20px; font-size: 1.5rem; text-align: center;}
    .benefits-box ul { list-style: none; }
    .benefits-box li { margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; }
    .check { color: #10b981; font-weight: bold; margin-right: 15px; font-size: 1.3rem; }
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
    </div>
  </div>
</body>
</html>`;

      zip.file("index.html", htmlContent);
      
      console.log('Gerando blob...');
      const content = await zip.generateAsync({ type: "blob" });
      
      console.log('Disparando download...');
      saveAs(content, "landing-page.zip");
      
      alert("Landing Page gerada com sucesso! O download do seu arquivo ZIP começou.");
    } catch (error) {
      console.error('Erro na geração do ZIP:', error);
      alert('Erro ao gerar o arquivo. Por favor, tente novamente.');
    }
  };

  return (
    <div className="container">
      <div className="t-center">
        <span className="badge">No-Code Factory</span>
        <h1>Gerador Rápido de LPs</h1>
      </div>

      <div className="card">
        <form onSubmit={generateZip}>
          <div className="form-group">
            <label>Headline (Sua Grande Promessa)</label>
            <input type="text" name="headline" className="form-input" value={data.headline} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Subheadline / Texto de Apoio</label>
            <textarea name="subheadline" className="form-input textarea" value={data.subheadline} onChange={handleChange} required />
          </div>

          <div className="row">
            <div className="col form-group">
              <label>Cor de Fundo da LP (HEX)</label>
              <input type="color" name="bgColor" style={{width: '100%', height:'50px', padding:'5px', background:'transparent', border:'none'}} value={data.bgColor} onChange={handleChange} />
            </div>
            <div className="col form-group">
              <label>Cor Principal (Botões e Destaques)</label>
              <input type="color" name="primaryColor" style={{width: '100%', height:'50px', padding:'5px', background:'transparent', border:'none'}} value={data.primaryColor} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Link de Checkout (Hotmart / Kiwify)</label>
            <input type="url" name="checkoutLink" className="form-input" value={data.checkoutLink} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Texto do Botão CTA</label>
            <input type="text" name="btnText" className="form-input" value={data.btnText} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>O que o cliente vai receber? (Um por linha)</label>
            <textarea name="benefits" className="form-input textarea" value={data.benefits} onChange={handleChange} style={{minHeight: '120px'}} required />
          </div>

          <button type="submit" className="btn">⚡ Gerar & Baixar Arquivo .ZIP</button>
        </form>
      </div>
    </div>
  );
}

export default App;
