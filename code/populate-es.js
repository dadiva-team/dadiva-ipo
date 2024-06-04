// Define the Elasticsearch URL and the index you want to target
const elasticsearchUrl = 'http://localhost:9200';
const formIndex = 'form';
const userIndex = 'users';
const inconsistenciesIndex = 'inconsistencies';
const submissionIndex = 'submissions';

const users = [
	{
		"nic": 123456789,
		"name": "John Doe",
		"hashedPassword": "MegaPassword123!hashed",
		"role": "donor"
	},
	{
		"nic": 111111111,
		"name": "Dr. Doe",
		"hashedpassword": "MegaPassword123!hashed",
		"role": "doctor"
	},
	{
		"nic": 987654321,
		"name": "Eng. Doe",
		"hashedpassword": "MegaPassword123!hashed",
		"role": "admin"
	}
]

// Define the object you want to index
const form = {"groups":[{"name":"Dádivas Anteriores","questions":[{"id":"q3","text":"Alguma vez deu sangue ou componentes sanguíneos?","type":"boolean","options":null},{"id":"q4","text":"Deu sangue há menos de 2 meses?","type":"boolean","options":null},{"id":"q5","text":"Alguma vez lhe foi aplicada uma suspensão para a dádiva de sangue?","type":"boolean","options":null},{"id":"q6","text":"Ocorreu alguma reação ou incidente nas dádivas anteriores?","type":"boolean","options":null},{"id":"q2","text":"Sente-se bem de saúde e em condições de dar sangue?","type":"boolean","options":null}]},{"name":"Viagens","questions":[{"id":"Q7","text":"Os seus pais biológicos nasceram e viveram sempre em Portugal?","type":"boolean","options":null},{"id":"Q8","text":"Nasceu e viveu sempre em Portugal?","type":"boolean","options":null},{"id":"Q8-1","text":"Quando mudou de país de residência?","type":"text","options":null},{"id":"Q8-2","text":"Quando mudou de país de residência?","type":"dropdown","options":["Antes de 2000"," Depois de 2000"]},{"id":"Q9","text":"Alguma vez viajou para fora do país?","type":"boolean","options":null},{"id":"Q10","text":"Nos últimos 4 meses viajou (mesmo que em trânsito), residiu ou trabalhou em alguma zona com foco de transmissão ativa/surto ou endémica para doença infeciosa?","type":"boolean","options":null},{"id":"Q11","text":"Viveu no Reino Unido mais de 12 meses cumulativos, entre janeiro de 1980 e dezembro de 1996?","type":"boolean","options":null}]},{"name":"Saúde Geral","questions":[{"id":"Q12","text":"Tem sido sempre saudável?","type":"boolean","options":null},{"id":"Q13","text":"Teve alguma doença crónica ou acidente grave?","type":"boolean","options":null},{"id":"Q14","text":"Já esteve internado(a) num hospital ou maternidade?","type":"boolean","options":null},{"id":"Q15","text":"Alguma vez fez uma cirurgia (incluindo cesariana)?","type":"boolean","options":null},{"id":"Q16","text":"Já teve convulsões e/ou ataques epiléticos?","type":"boolean","options":null},{"id":"Q17","text":"Foi submetido a um transplante de tecidos (ex.: córnea), células ou à administração de outros produtos biológicos?","type":"boolean","options":null},{"id":"Q18","text":"Recebeu alguma transfusão depois de 1980?","type":"boolean","options":null}]},{"name":"Sintomas","questions":[{"id":"Q19","text":"Nos últimos 3 meses perdeu peso por motivos de saúde ou desconhecidos?","type":"boolean","options":null},{"id":"Q20","text":"No último mês teve algum problema de saúde (ex.: tosse, febre, dores musculares, dores de cabeça, cansaço fácil, dificuldade em respirar, falta de paladar, falta de olfato, diarreia, vómitos, alterações cutâneas ou outros)?","type":"boolean","options":null}]},{"name":"Possíveis Pontos de Entrada","questions":[{"id":"Q21","text":"Nos últimos 3 meses esteve em contacto próximo com caso suspeito ou positivo de doença infecciosa?","type":"boolean","options":null},{"id":"Q22","text":"Tomou ou está a tomar medicamentos?","type":"boolean","options":null},{"id":"Q23","text":"Fez ou está a fazer profilaxia ou tratamento para doença infeciosa?","type":"boolean","options":null},{"id":"Q24","text":"Nos últimos 7 dias fez tratamento ou extração dentária?","type":"boolean","options":null},{"id":"Q25","text":"No último mês tomou alguma vacina?","type":"boolean","options":null},{"id":"Q26","text":"Fez ou está a fazer algum tratamento para a infertilidade?","type":"boolean","options":null},{"id":"Q27","text":"Está ou esteve grávida?","type":"boolean","options":null}]},{"name":"Mais Pontos de Entrada","questions":[{"id":"Q28","text":"Nos últimos 4 meses fez alguma tatuagem, colocou piercing ou fez tratamento de acupuntura ou de mesoterapia?","type":"boolean","options":null},{"id":"Q29","text":"Nos últimos 4 meses fez alguna endoscopia (ex.: gastroscópia, colonoscopia, citostopia)?","type":"boolean","options":null}]},{"name":"Comportamentos de Risco","questions":[{"id":"Q30","text":"Nos últimos 3 meses teve contacto sexual com uma nova pessoa","type":"boolean","options":null},{"id":"Q31","text":"Nos últimos 3 meses teve contacto sexual com mais do que uma pessoa","type":"boolean","options":null},{"id":"Q32","text":"Nos últimos 12 meses teve contacto sexual com uma pessoa infetada ou em tratamento para o Vírus da SIDA (VIH), Hepatite B, C ou Sífilis?","type":"boolean","options":null},{"id":"Q33","text":"Alguma vez teve contactos sexuais mediante recebimento de contrapartidas financeiras ou equivalentes (dinheiro, drogas ou outras)?","type":"boolean","options":null},{"id":"Q34","text":"Alguma vez consumiu drogas (injetáveis, inaláveis, ingeridas ou outras)?","type":"boolean","options":null},{"id":"Q35","text":"A pessoa com quem tem contacto sexual tem algum dos comportamentos referidos nas questões 31, 33 e 34?","type":"boolean","options":null}]}],"rules":[{"conditions":{"any":null,"all":[]},"event":{"type":"showQuestion","params":{"id":"q3"}}},{"conditions":{"any":null,"all":[{"fact":"q3","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"q4"}}},{"conditions":{"any":null,"all":[{"fact":"q4","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"q5"}}},{"conditions":{"any":null,"all":[{"fact":"q5","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"q6"}}},{"conditions":{"any":null,"all":[{"fact":"q6","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"q2"}}},{"conditions":{"any":null,"all":[{"fact":"q3","operator":"notEqual","value":""},{"fact":"q4","operator":"notEqual","value":""},{"fact":"q5","operator":"notEqual","value":""},{"fact":"q6","operator":"notEqual","value":""},{"fact":"q2","operator":"notEqual","value":""}]},"event":{"type":"nextGroup"}},{"conditions":{"any":null,"all":[]},"event":{"type":"showQuestion","params":{"id":"Q7"}}},{"conditions":{"any":null,"all":[{"fact":"Q7","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q8"}}},{"conditions":{"any":null,"all":[{"fact":"Q8","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q8-1"}}},{"conditions":{"any":null,"all":[{"fact":"Q8-1","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q8-2"}}},{"conditions":{"any":null,"all":[{"fact":"Q8-2","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q9"}}},{"conditions":{"any":null,"all":[{"fact":"Q9","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q10"}}},{"conditions":{"any":null,"all":[{"fact":"Q10","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q11"}}},{"conditions":{"any":null,"all":[{"fact":"Q7","operator":"notEqual","value":""},{"fact":"Q8","operator":"notEqual","value":""},{"fact":"Q8-1","operator":"notEqual","value":""},{"fact":"Q8-2","operator":"notEqual","value":""},{"fact":"Q9","operator":"notEqual","value":""},{"fact":"Q10","operator":"notEqual","value":""},{"fact":"Q11","operator":"notEqual","value":""}]},"event":{"type":"nextGroup"}},{"conditions":{"any":null,"all":[]},"event":{"type":"showQuestion","params":{"id":"Q12"}}},{"conditions":{"any":null,"all":[{"fact":"Q12","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q13"}}},{"conditions":{"any":null,"all":[{"fact":"Q13","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q14"}}},{"conditions":{"any":null,"all":[{"fact":"Q14","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q15"}}},{"conditions":{"any":null,"all":[{"fact":"Q15","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q16"}}},{"conditions":{"any":null,"all":[{"fact":"Q16","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q17"}}},{"conditions":{"any":null,"all":[{"fact":"Q17","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q18"}}},{"conditions":{"any":null,"all":[{"fact":"Q12","operator":"notEqual","value":""},{"fact":"Q13","operator":"notEqual","value":""},{"fact":"Q14","operator":"notEqual","value":""},{"fact":"Q15","operator":"notEqual","value":""},{"fact":"Q16","operator":"notEqual","value":""},{"fact":"Q17","operator":"notEqual","value":""},{"fact":"Q18","operator":"notEqual","value":""}]},"event":{"type":"nextGroup"}},{"conditions":{"any":null,"all":[]},"event":{"type":"showQuestion","params":{"id":"Q19"}}},{"conditions":{"any":null,"all":[{"fact":"Q19","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q20"}}},{"conditions":{"any":null,"all":[{"fact":"Q19","operator":"notEqual","value":""},{"fact":"Q20","operator":"notEqual","value":""}]},"event":{"type":"nextGroup"}},{"conditions":{"any":null,"all":[]},"event":{"type":"showQuestion","params":{"id":"Q21"}}},{"conditions":{"any":null,"all":[{"fact":"Q21","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q22"}}},{"conditions":{"any":null,"all":[{"fact":"Q22","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q23"}}},{"conditions":{"any":null,"all":[{"fact":"Q23","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q24"}}},{"conditions":{"any":null,"all":[{"fact":"Q24","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q25"}}},{"conditions":{"any":null,"all":[{"fact":"Q25","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q26"}}},{"conditions":{"any":null,"all":[{"fact":"Q26","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q27"}}},{"conditions":{"any":null,"all":[{"fact":"Q21","operator":"notEqual","value":""},{"fact":"Q22","operator":"notEqual","value":""},{"fact":"Q23","operator":"notEqual","value":""},{"fact":"Q24","operator":"notEqual","value":""},{"fact":"Q25","operator":"notEqual","value":""},{"fact":"Q26","operator":"notEqual","value":""},{"fact":"Q27","operator":"notEqual","value":""}]},"event":{"type":"nextGroup"}},{"conditions":{"any":null,"all":[]},"event":{"type":"showQuestion","params":{"id":"Q28"}}},{"conditions":{"any":null,"all":[{"fact":"Q28","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q29"}}},{"conditions":{"any":null,"all":[{"fact":"Q28","operator":"notEqual","value":""},{"fact":"Q29","operator":"notEqual","value":""}]},"event":{"type":"nextGroup"}},{"conditions":{"any":null,"all":[]},"event":{"type":"showQuestion","params":{"id":"Q30"}}},{"conditions":{"any":null,"all":[{"fact":"Q30","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q31"}}},{"conditions":{"any":null,"all":[{"fact":"Q31","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q32"}}},{"conditions":{"any":null,"all":[{"fact":"Q32","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q33"}}},{"conditions":{"any":null,"all":[{"fact":"Q33","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q34"}}},{"conditions":{"any":null,"all":[{"fact":"Q34","operator":"notEqual","value":""}]},"event":{"type":"showQuestion","params":{"id":"Q35"}}},{"conditions":{"any":null,"all":[{"fact":"Q30","operator":"notEqual","value":""},{"fact":"Q31","operator":"notEqual","value":""},{"fact":"Q32","operator":"notEqual","value":""},{"fact":"Q33","operator":"notEqual","value":""},{"fact":"Q34","operator":"notEqual","value":""},{"fact":"Q35","operator":"notEqual","value":""}]},"event":{"type":"showReview"}}]}

const inconsistencies = {"inconsistencies":[]};
const submissions = {"submissions":[]};

// Function to index the document to Elasticsearch
async function indexDocument(index, document) {
  const url = `${elasticsearchUrl}/${index}/_doc`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
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
      method: 'DELETE'
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

// Delete the current forms
deleteIndex(formIndex).then(() => {
	// Index the form
	indexDocument(formIndex, form);
});
// Delete the current users
deleteIndex(userIndex).then(() => {
	// Index the User
	users.forEach(user => {
		putDocument(userIndex, user, user.nic);
	})
});
// Delete the current inconsistencies
deleteIndex(inconsistenciesIndex).then(() => {
	// Index the inconsistencies
	indexDocument(inconsistenciesIndex, inconsistencies);
});

deleteIndex(submissionIndex).then(() => {

  // Index the submission
  //putDocument(submissionIndex, submission, submission.nic)
})