export default function PoliticaDePrivacidade() {
  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        margin: "40px auto",
        maxWidth: "800px",
        lineHeight: 1.6,
        color: "#333",
      }}
    >
      <h1 style={{ color: "#fd9200" }}>Política de Privacidade - Nativa OnStreaming</h1>
      <p>Última atualização: 10 de outubro de 2025</p>

      <p>
        A equipe da <strong>Nativa OnStreaming</strong> respeita a sua privacidade e está
        comprometida em proteger as informações pessoais dos usuários do aplicativo.
      </p>

      <h2 style={{ color: "#fd9200" }}>1. Coleta de informações</h2>
      <p>
        O aplicativo pode solicitar permissões para acessar o <strong>microfone</strong> e a{" "}
        <strong>localização</strong> do dispositivo. Essas permissões são usadas
        exclusivamente para permitir a reprodução contínua de áudio e melhorar a experiência
        do usuário. Nenhum dado pessoal é coletado, armazenado ou compartilhado com terceiros.
      </p>

      <h2 style={{ color: "#fd9200" }}>2. Uso das informações</h2>
      <p>As informações coletadas (quando autorizadas pelo usuário) são utilizadas apenas para:</p>
      <ul>
        <li>Reprodução e controle de áudio;</li>
        <li>Notificações de novas transmissões;</li>
        <li>Melhoria do desempenho e experiência do app.</li>
      </ul>

      <h2 style={{ color: "#fd9200" }}>3. Compartilhamento de informações</h2>
      <p>
        Não compartilhamos dados pessoais com terceiros. Em nenhuma hipótese vendemos,
        alugamos ou divulgamos dados de nossos usuários.
      </p>

      <h2 style={{ color: "#fd9200" }}>4. Permissões utilizadas</h2>
      <ul>
        <li>
          <strong>INTERNET</strong>: necessário para reproduzir transmissões de rádio.
        </li>
        <li>
          <strong>WAKE_LOCK</strong>: mantém o áudio ativo enquanto o dispositivo está em uso.
        </li>
        <li>
          <strong>RECORD_AUDIO</strong>: apenas se o usuário ativar gravações internas.
        </li>
        <li>
          <strong>FOREGROUND_SERVICE</strong>: permite a reprodução em segundo plano.
        </li>
        <li>
          <strong>POST_NOTIFICATIONS</strong>: envia alertas sobre novos programas ou atualizações.
        </li>
      </ul>

      <h2 style={{ color: "#fd9200" }}>5. Retenção e exclusão</h2>
      <p>
        Nenhum dado pessoal é retido ou armazenado nos nossos servidores. O aplicativo não
        solicita cadastro e não utiliza banco de dados com informações pessoais.
      </p>

      <h2 style={{ color: "#fd9200" }}>6. Segurança</h2>
      <p>
        Empregamos medidas de segurança compatíveis com o mercado para proteger as informações
        transmitidas pelo aplicativo.
      </p>

      <h2 style={{ color: "#fd9200" }}>7. Alterações nesta política</h2>
      <p>
        Esta política pode ser atualizada ocasionalmente. Recomendamos revisar esta página
        periodicamente para estar ciente de quaisquer alterações.
      </p>

      <h2 style={{ color: "#fd9200" }}>8. Contato</h2>
      <p>
        Em caso de dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo
        e-mail:{" "}
        <a
          href="mailto:contas@nativaonstream.com"
          style={{ color: "#fd9200", textDecoration: "none" }}
        >
          contas@nativaonstream.com
        </a>
      </p>

      <hr />
      <p>© 2025 Nativa OnStreaming - Todos os direitos reservados.</p>
    </main>
  );
}
