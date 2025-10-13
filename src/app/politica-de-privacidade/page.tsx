export default function PoliticaPage() {
  return (
    <div style={{ backgroundColor: "#fafafa", color: "#222", lineHeight: 1.6, margin: 0, padding: 0 }}>
      <header
        style={{
          background: "linear-gradient(90deg, #ff7b00, #ff2e78)",
          color: "#fff",
          textAlign: "center",
          padding: "40px 10px 20px 10px",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo Rádio Nativa"
          style={{ width: "140px", height: "auto", display: "block", margin: "0 auto 10px auto" }}
        />
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
          Política de Privacidade - Rádio Nativa
        </h1>
      </header>

      <main
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "0 20px 60px 20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p>
          <strong>Última atualização:</strong> 09 de outubro de 2025
        </p>

        <p>
          A <strong>Rádio Nativa</strong> respeita sua privacidade e está comprometida em proteger
          os dados pessoais dos usuários. Esta Política de Privacidade explica como coletamos,
          usamos, armazenamos e protegemos suas informações quando você utiliza o nosso aplicativo
          móvel disponível na Google Play Store.
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>1. Informações que coletamos</h2>
        <p>
          O aplicativo <strong>Rádio Nativa</strong> pode coletar informações técnicas como tipo de
          dispositivo, sistema operacional, idioma, versão do aplicativo e dados de desempenho,
          usados apenas para melhorar o funcionamento do app.
        </p>
        <p>
          Nenhum dado pessoal sensível é coletado sem o seu consentimento explícito.
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>2. Como usamos suas informações</h2>
        <p>Os dados são utilizados para:</p>
        <ul style={{ marginLeft: "20px" }}>
          <li>Garantir o funcionamento do streaming de áudio ao vivo;</li>
          <li>Melhorar a estabilidade e desempenho do aplicativo;</li>
          <li>Enviar notificações e atualizações relacionadas à programação;</li>
          <li>Atender solicitações de suporte do usuário.</li>
        </ul>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>3. Compartilhamento de dados</h2>
        <p>
          A <strong>Rádio Nativa</strong> não vende nem compartilha informações pessoais com
          terceiros. Alguns dados técnicos podem ser utilizados por serviços como o{" "}
          <strong>Firebase</strong> para análise e melhorias.
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>4. Armazenamento e segurança</h2>
        <p>
          Os dados são armazenados em servidores protegidos com medidas de segurança padrão da
          indústria. Mantemos as informações apenas pelo tempo necessário para cumprir as
          finalidades descritas.
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>5. Privacidade de menores</h2>
        <p>
          O aplicativo não é destinado a menores de 13 anos e não coleta dados intencionais de
          crianças. Caso algum dado seja identificado, ele será excluído imediatamente.
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>6. Permissões utilizadas</h2>
        <ul style={{ marginLeft: "20px" }}>
          <li>
            <strong>Acesso à Internet:</strong> necessário para reproduzir o áudio da rádio.
          </li>
          <li>
            <strong>Notificações (opcional):</strong> usadas apenas para avisos sobre programação
            ou eventos.
          </li>
        </ul>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>7. Serviços de terceiros</h2>
        <p>
          O aplicativo pode conter links para sites externos. A <strong>Rádio Nativa</strong> não se
          responsabiliza pelas práticas de privacidade desses serviços. Recomendamos a leitura das
          políticas de privacidade de cada site.
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>8. Direitos do usuário</h2>
        <p>
          Em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>, você pode solicitar
          acesso, correção ou exclusão dos seus dados pessoais, bem como revogar consentimentos
          concedidos.
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>9. Contato</h2>
        <p>Para dúvidas, solicitações ou reclamações sobre esta Política de Privacidade:</p>
        <p>
          📧 <strong>E-mail:</strong>{" "}
          <a href="mailto:contato@radionativaon.com.br" style={{ color: "#ff2e78" }}>
            contato@radionativaon.com.br
          </a>
          <br />
          🌐 <strong>Site:</strong>{" "}
          <a href="https://www.radionativaon.com.br" style={{ color: "#ff2e78" }}>
            https://www.radionativaon.com.br
          </a>
        </p>

        <h2 style={{ color: "#ff7b00", marginTop: "30px" }}>10. Alterações desta política</h2>
        <p>
          Poderemos atualizar esta política periodicamente. A versão mais recente estará sempre
          disponível dentro do aplicativo e em nosso site oficial.
        </p>

        <p>Ao continuar utilizando o aplicativo, você concorda com os termos desta Política.</p>
      </main>

      <footer
        style={{
          background: "#111",
          color: "#fff",
          textAlign: "center",
          padding: "15px 10px",
          fontSize: "0.9rem",
        }}
      >
        <p>© 2025 Rádio Nativa — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
