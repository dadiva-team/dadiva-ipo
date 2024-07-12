// Define the Elasticsearch URL and the index you want to target
const elasticsearchUrl = 'http://localhost:9200';
const termsIndex = 'terms';
const manualIndex = 'manual';

const terms = {
  'terms': `
  <div class="container">
        <h1>Termos e Condições para Doação de Sangue</h1>
        <p>Ao participar na doação de sangue, você concorda com os seguintes termos e condições:</p>
        
        <h2>Requisitos para Doação</h2>
        <ul>
            <li>Idade entre 18 e 65 anos.</li>
            <li>Peso mínimo de 50 kg.</li>
            <li>Estar em boas condições de saúde.</li>
            <li>Ter hábitos de vida saudáveis.</li>
            <li>Não ter doenças infecciosas ou crónicas que contraindiquem a doação.</li>
        </ul>
        
        <h2>Procedimento de Doação</h2>
        <ul>
            <li>O processo de doação é seguro e realizado por profissionais de saúde qualificados.</li>
            <li>Será colhida uma quantidade de sangue de aproximadamente 450 ml.</li>
            <li>Antes da doação, será realizado um exame médico e uma avaliação clínica.</li>
            <li>O doador deve informar o médico sobre qualquer medicação ou condição médica pré-existente.</li>
        </ul>
        
        <h2>Direitos e Deveres do Doador</h2>
        <ul>
            <li>O doador tem o direito de ser tratado com respeito e dignidade.</li>
            <li>O doador deve fornecer informações verdadeiras e completas durante a avaliação.</li>
            <li>O doador tem o direito de recusar a doação a qualquer momento.</li>
            <li>O doador deve seguir as recomendações médicas após a doação, incluindo o descanso e hidratação adequados.</li>
        </ul>
        
        <h2>Proteção de Dados</h2>
        <ul>
            <li>Os dados pessoais dos doadores serão tratados de acordo com a legislação de proteção de dados vigente.</li>
            <li>As informações coletadas serão utilizadas exclusivamente para fins médicos e estatísticos.</li>
            <li>O doador tem o direito de acessar, retificar e solicitar a exclusão de seus dados pessoais a qualquer momento.</li>
        </ul>
        
        <p>Ao continuar com a doação, você confirma que leu e compreendeu estes termos e condições, e concorda em cumpri-los.</p>
    </div>
  `,
  "authors": ["Dr. Doe"]
}

const manualEntries = [
  {
    'groupName': 'Antiácidos, incluindo agonistas de recetores H2 e inibidores da bomba de protões',
    'examples': [
      {
        'examples': 'Ulcermin,Kompensan,Omeprazole,Pantoprazole',
        'criteria': [
          '<p>Se assintomático - <strong><span style="color: green;">Apto</span></strong></p>',
          '<p>Se sob estudo e até à conclusão do mesmo - <strong><span style="color: orange;">Suspensão Temporária de 30 dias</span></strong></p>',
        ],
      },
      {
        'examples': 'Misoprostol, Cytotec (potencialmente abortivo)',
        'criteria': [
          '<p><strong><span style="color: orange;">Suspensão Temporária de 30 dias</span></strong></p>',
        ],
      },
    ],
  },
  {
    'groupName': 'Anti-Inflamatórios não esteroides (AINES)',
    'examples': [
      {
        'examples': 'Clonixina, Ibuprofeno, Nimesulide, Diclofenac, Naproxeno, Etoricoxib',
        'criteria': [
          '<p>Avaliar doença de base.<br>Colheita de Sangue Total dar indicação para não separar para plaquetas - <strong><span style="color: green;">APTO</span></strong><br>Colheita para CEA e PFA - <strong><span style="color: green;">APTO</span></strong></p>',
          '<p>Colheita CPA - <strong><span style="color: orange;">Suspensão Temporária de 5 dias após a última toma</span></strong></p>',
        ],
      },
    ],

  },
  {
    'groupName': 'Anticoagulantes',
    'examples': [
      {
        'examples': 'Heparina',
        'criteria': [
          '<p>Avaliar causa da prescrição.<br><strong><span style="color: orange;">Suspensão Temporária de 3 dias após a última administração</span></strong></p>',
        ],
      },
      {
        'examples': 'Antagonistas da Vitamina K - Varfarina Varfine, Acenocumarol, Sintrom; Inibidores da Trombina - Dabigatrano; Pradaxa; Inibidor direto do fator Xa - Rivaroxabano; Xarelto Apixabano; Eliquis Edoxabano; Lixiana;',
        'criteria': [
          '<p>Avaliar a doença de base que poderá ser motivo de <strong><span style="color: red;">Suspensão Definitiva</span></strong></p>',
        ],
      },
    ],

  },
  {
    'groupName': 'Analgésicos',
    'examples': [
      {
        'examples': 'Paracetamol, Ben U Ron, Tramadol, Tramal, Zaldiar',
        'criteria': [
          '<p>Avaliar doença de base, pois não contraindicam a dádiva - <strong><span style="color: green;">Apto</span></strong></p>',
        ],
      },
      {
        'examples': 'Analgésicos Opioides',
        'criteria': [
          '<p>Critério Clínico - <strong><span style="color: orange;">Suspensão Temporária</span></strong></p>',
        ],
      },
    ],
  },

];

// Function to index the document to Elasticsearch
async function indexDocument(index, document) {
  const url = `${elasticsearchUrl}/${index}/_doc`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Document indexed successfully:', jsonResponse);
    } else {
      console.error('Failed to index document:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error indexing document:', error);
  }
}

async function putDocument(index, document, id) {
  const url = `${elasticsearchUrl}/${index}/_doc/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Document indexed successfully:', jsonResponse);
    } else {
      console.error('Failed to index document:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error indexing document:', error);
  }
}

async function deleteIndex(index) {
  const url = `${elasticsearchUrl}/${index}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log('Index(', index, ') deleted successfully', jsonResponse);
    } else {
      console.error('Failed to delete index:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error deleting index:', error);
  }
}

// Delete the current inconsistencies
deleteIndex(termsIndex).then(() => {
  // Index the inconsistencies
  indexDocument(termsIndex, terms);
});

deleteIndex(manualIndex).then(() => {
  // Index the inconsistencies
  manualEntries.forEach((entry, index) => {
    indexDocument(manualIndex, entry);
  });
});