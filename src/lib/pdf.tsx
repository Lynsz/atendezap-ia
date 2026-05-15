import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

type KitOutput = Record<string, unknown>;

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#14201b", fontFamily: "Helvetica" },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 8 },
  subtitle: { fontSize: 12, color: "#475569", marginBottom: 22 },
  section: { marginBottom: 14 },
  h2: { fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#087858" },
  text: { lineHeight: 1.5, marginBottom: 4 },
  item: { marginBottom: 6, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: "#d4f9eb" }
});

function text(value: unknown) {
  if (typeof value === "string") return value;
  return "";
}

function list(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.h2}>{title}</Text>
      {children}
    </View>
  );
}

function StringList({ items }: { items: unknown[] }) {
  return (
    <>
      {items.map((item, index) => (
        <Text style={styles.text} key={`${text(item)}-${index}`}>
          {index + 1}. {text(item)}
        </Text>
      ))}
    </>
  );
}

function QuickReplies({ items }: { items: unknown[] }) {
  return (
    <>
      {items.map((item, index) => {
        const reply = item as { title?: unknown; message?: unknown };
        return (
          <View style={styles.item} key={`${text(reply.title)}-${index}`}>
            <Text style={styles.text}>{text(reply.title) || `Resposta ${index + 1}`}</Text>
            <Text style={styles.text}>{text(reply.message)}</Text>
          </View>
        );
      })}
    </>
  );
}

export function KitPdf({ businessName, aiOutput }: { businessName: string; aiOutput: KitOutput }) {
  return (
    <Document title={`AtendeZap IA - Kit ${businessName}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>AtendeZap IA - Kit de Atendimento para WhatsApp Business</Text>
        <Text style={styles.subtitle}>Negócio: {businessName}</Text>

        <Section title="1. Como usar este kit">
          <StringList items={list(aiOutput.usage_manual)} />
        </Section>
        <Section title="2. Mensagem de boas-vindas">
          <Text style={styles.text}>{text(aiOutput.welcome_message)}</Text>
        </Section>
        <Section title="3. Mensagem de ausência">
          <Text style={styles.text}>{text(aiOutput.away_message)}</Text>
        </Section>
        <Section title="4. Respostas rápidas">
          <QuickReplies items={list(aiOutput.quick_replies)} />
        </Section>
        <Section title="5. Perguntas de qualificação">
          <StringList items={list(aiOutput.qualification_questions)} />
        </Section>
        <Section title="6. Follow-ups">
          <StringList items={list(aiOutput.follow_ups)} />
        </Section>
        <Section title="7. Mensagens para clientes que sumiram">
          <StringList items={list(aiOutput.lost_customer_messages)} />
        </Section>
        <Section title="8. Pós-venda">
          <StringList items={list(aiOutput.post_sale_messages)} />
        </Section>
        <Section title="9. Frases para status">
          <StringList items={list(aiOutput.status_phrases)} />
        </Section>
        <Section title="10. Etiquetas recomendadas">
          <StringList items={list(aiOutput.labels)} />
        </Section>
        <Section title="11. Fluxo de atendimento">
          <StringList items={list(aiOutput.service_flow)} />
        </Section>
        <Section title="12. Manual rápido">
          <StringList items={list(aiOutput.usage_manual)} />
        </Section>
      </Page>
    </Document>
  );
}

export async function renderKitPdfBuffer({ businessName, aiOutput }: { businessName: string; aiOutput: KitOutput }) {
  return renderToBuffer(<KitPdf businessName={businessName} aiOutput={aiOutput} />);
}
