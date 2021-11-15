export const modelData = {
  name: 'SRK-Serviços',
  year: '2021-11-15',
  description: 'Uma bela descrição',
  modelLevels: [
    {
      initial: 'A',
      name: 'Em Otimização'
    },
    {
      initial: 'B',
      name: 'Gerenciado Quantitativamente'
    },
    {
      initial: 'C',
      name: 'Definido'
    },
    {
      initial: 'D',
      name: 'Largamente Definido'
    },
    {
      initial: 'E',
      name: 'Parcialmente Definido'
    },
    {
      initial: 'F',
      name: 'Gerenciado'
    },
    {
      initial: 'G',
      name: 'Parcialmente Gerenciado'
    }
  ],
  modelProcesses: [
    {
      name: 'Gerencia de Projetos',
      initial: 'GPR',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'Gpr-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'G',
          maxLevel: 'G'
        }
      ]
    },
    {
      name: 'Gerencia de Requisitos',
      initial: 'GRE',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'GRE-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'G',
          maxLevel: 'G'
        }
      ]
    },
    {
      name: 'Aquisição',
      initial: 'AQU',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'Aqu-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'F'
        }
      ]
    },
    {
      name: 'Medição',
      initial: 'MED',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'Med-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'F'
        }
      ]
    },
    {
      name: 'Gerencia de Reutilização',
      initial: 'GRU',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'Gru-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'E'
        }
      ]
    },
    {
      name: 'Gerencia de Recursos Humanos',
      initial: 'GRH',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'GRH-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'E'
        }
      ]
    },
    {
      name: 'Verificação',
      initial: 'VER',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'VER-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'D'
        }
      ]
    },
    {
      name: 'Validação',
      initial: 'VAL',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'VAL-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'D'
        }
      ]
    },
    {
      name: 'Gerencia de Riscos',
      initial: 'GRI',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'GRI-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'C'
        }
      ]
    },
    {
      name: 'Gerencia de Decisões',
      initial: 'GDE',
      description: 'Define a maturidade de gerencia de projetos',
      expectedResults: [
        {
          name: 'O escopo do trabalho para o projeto é definido',
          initial: 'GDE-1',
          description:
            'O escopo do projeto define todo o trabalho necessário, e somente ele, para entregarum produto que satisfaça as necessidades, características e funções especificadaspara o projeto, de forma a concluí-lo com sucesso.',
          minLevel: 'C'
        }
      ]
    }
  ]
}
