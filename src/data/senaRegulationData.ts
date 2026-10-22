import {
  InductionModule,
  QuizQuestion,
  CaseDilemma,
  CardSortItem,
  Badge,
} from '../types/induction';

export const SENA_PROGRAMS = [
  'ADSO - Análisis y Desarrollo de Software',
  'Gestión de Redes de Datos',
  'Gestión Administrativa',
  'Contabilidad y Finanzas',
  'Mantenimiento Mecatrónico de Automotores',
  'Diseño e Integración de Multimedia',
  'Seguridad y Salud en el Trabajo',
  'Producción Agropecuaria Ecológica',
  'Cocina y Gastronomía Colombiana',
  'Mercadeo y Ventas',
  'Enfermería y Servicios de Salud',
  'Construcción y Obras Civiles'
];

export const SENA_REGIONALES = [
  { regional: 'Distrito Capital', center: 'Centro de Tecnologías del Transporte - Regional D.C.' },
  { regional: 'Distrito Capital', center: 'Centro de Gestión de Mercados, Logística y TIC' },
  { regional: 'Distrito Capital', center: 'Centro de Electricidad, Electrónica y Telecomunicaciones' },
  { regional: 'Antioquia', center: 'Centro de Servicios y Gestión Empresarial - Medellín' },
  { regional: 'Antioquia', center: 'Centro de Tecnología de la Manufactura Avanzada' },
  { regional: 'Valle del Cauca', center: 'Centro de Diseño Tecnológico Industrial - Cali' },
  { regional: 'Valle del Cauca', center: 'Centro de la Construcción - Cali' },
  { regional: 'Santander', center: 'Centro Industrial del Mantenimiento Integral - Girón' },
  { regional: 'Atlántico', center: 'Centro Nacional Colombo Alemán - Barranquilla' },
  { regional: 'Bolívar', center: 'Centro para el Desarrollo Agroecológico y Agroindustrial' },
  { regional: 'Caldas', center: 'Centro de Automatización Industrial - Manizales' },
  { regional: 'Risaralda', center: 'Centro de Diseño e Innovación Tecnológica Industrial' },
  { regional: 'Huila', center: 'Centro de la Industria, la Empresa y los Servicios - Neiva' },
  { regional: 'Tolima', center: 'Centro de Industria y de la Construcción - Ibagué' }
];

export const INDUCTION_MODULES: InductionModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Identidad SENA, Fases y Marco Normativo',
    shortTitle: 'Identidad y Fases',
    icon: 'Compass',
    summary: 'Comprende la misión del SENA, el nuevo Acuerdo 009 de 2024, las etapas formativas (Lectiva y Productiva) y los canales institucionales.',
    estimatedMinutes: 8,
    pointsReward: 150,
    completed: false,
    sections: [
      {
        id: 's1-1',
        title: '1. ¿Qué es el SENA y cuál es la misión formativa?',
        badgeTag: 'Identidad Institucional',
        keyArticles: 'Estatuto de la Formación Profesional y Constitución Art. 54',
        content: [
          'El Servicio Nacional de Aprendizaje (SENA) es un establecimiento público del orden nacional, con personería jurídica y autonomía administrativa, adscrito al Ministerio del Trabajo.',
          'Su misión es brindar Formación Profesional Integral (FPI) gratuita para incorporar a las personas en actividades productivas que contribuyan al desarrollo social, económico y tecnológico del país.',
          'El aprendiz SENA es el protagonista de su propio aprendizaje, orientado bajo principios éticos, de solidaridad, innovación y trabajo en equipo.'
        ],
        practicalTip: 'El carné del SENA te identifica como aprendiz en todo el país y te otorga acceso a bibliotecas, centros de convivencia y convenios de bienestar.'
      },
      {
        id: 's1-2',
        title: '2. El Marco Normativo: Del Acuerdo 007/2012 al Acuerdo 009/2024',
        badgeTag: 'Normatividad Vigente',
        keyArticles: 'Acuerdo 009 de 2024 - Consejo Directivo Nacional',
        content: [
          'El Reglamento del Aprendiz es la carta de navegación de tus derechos, deberes, prohibiciones y debido proceso durante toda tu permanencia formativa.',
          'El nuevo Acuerdo 009 de 2024 actualizó las normas previas (derogando los Acuerdos 007 de 2012 y modificaciones posteriores) para responder a la educación híbrida, plataformas digitales como Zajuna/Territorium/SofiaPlus y el debido proceso garantista.',
          'Aplica a todos los aprendices matriculados en programas de formación titulada o complementaria, en modalidades presencial, virtual o a distancia.'
        ],
        practicalTip: 'Todo aprendiz tiene el derecho inalienable a la presunción de inocencia y a ser escuchado ante el Comité de Evaluación y Seguimiento.'
      },
      {
        id: 's1-3',
        title: '3. Las Dos Grandes Etapas de tu Formación',
        badgeTag: 'Ruta Formativa',
        keyArticles: 'Etapa Lectiva y Etapa Productiva',
        content: [
          'Etapa Lectiva: Período en el cual adquieres conocimientos teóricos, metodológicos y prácticos guiados por instructores a través de proyectos formativos y guías de aprendizaje.',
          'Etapa Productiva: Momento de aplicación y transferencia del conocimiento en un entorno real. Se puede desarrollar mediante Contrato de Aprendizaje, Proyecto Productivo, Pasantía, Vínculo Laboral o Monitoría.',
          'Para certificarte como Técnico o Tecnólogo, es requisito obligatorio haber aprobado satisfactoriamente AMBAS etapas en los tiempos reglamentarios.'
        ],
        practicalTip: 'Debes registrar y legalizar tu alternativa de etapa productiva oportunamente con la Coordinación Académica.'
      }
    ]
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Derechos del Aprendiz SENA',
    shortTitle: 'Derechos del Aprendiz',
    icon: 'ShieldCheck',
    summary: 'Conoce los 12 derechos esenciales: educación de calidad, bienestar al aprendiz, representación, planes de mejoramiento y debido proceso.',
    estimatedMinutes: 10,
    pointsReward: 200,
    completed: false,
    sections: [
      {
        id: 's2-1',
        title: '1. Derechos Académicos y Formativos',
        badgeTag: 'Derecho a la Calidad',
        keyArticles: 'Acuerdo 009/2024 - Cap. II, Derechos',
        content: [
          'Recibir formación profesional integral de calidad, acorde con las competencias del programa y las tecnologías vigentes.',
          'Disponer de los recursos físicos, didácticos, técnicos, tecnológicos y bibliográficos necesarios para tu proceso de formación.',
          'Conocer al inicio de la formación el programa curricular, los resultados de aprendizaje, los criterios de evaluación y los instructores asignados.',
          'Recibir oportunamente las calificaciones y retroalimentación pedagógica sobre el avance de las evidencias de aprendizaje.'
        ],
        practicalTip: 'Tienes derecho a solicitar revisión justificada de una evaluación dentro de los 3 días hábiles siguientes a su publicación.'
      },
      {
        id: 's2-2',
        title: '2. Bienestar al Aprendiz y Apoyos Socioeconómicos',
        badgeTag: 'Bienestar Integral',
        keyArticles: 'Plan Nacional de Bienestar al Aprendiz',
        content: [
          'Disfrutar de los programas de Bienestar al Aprendiz en áreas de salud, deporte, cultura, liderazgo y orientación psicopedagógica.',
          'Postularte a apoyos de sostenimiento (regular o FIC para construcción), monitorías y subsidios según los cupos y requisitos socioeconómicos.',
          'Estar cubierto por la póliza de accidentes escolares del SENA durante el desarrollo de las actividades formativas.'
        ],
        practicalTip: 'El área de Bienestar no solo atiende dificultades, sino que ofrece torneos deportivos, semilleros culturales y formación en habilidades blandas.'
      },
      {
        id: 's2-3',
        title: '3. Representación Democrática y Debido Proceso',
        badgeTag: 'Voz y Participación',
        keyArticles: 'Debido Proceso y Libre Asociación',
        content: [
          'Elegir y ser elegido democráticamente como Representante de Aprendices de tu Centro de Formación o Vocero de Ficha.',
          'Ser tratado con dignidad, equidad y respeto mutuo, sin ningún tipo de discriminación por género, etnia, religión, condición social u opinión política.',
          'Gozar del derecho al debido proceso: ser escuchado, controvertir pruebas, presentar descargos y contar con asesoría en cualquier instancia disciplinaria o académica.'
        ],
        practicalTip: 'Si se inicia un trámite de queja en tu contra, la coordinación DEBE notificarte formalmente con las pruebas antes de citar a comité.'
      }
    ]
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Deberes del Aprendiz SENA',
    shortTitle: 'Deberes y Compromisos',
    icon: 'BookOpenCheck',
    summary: 'Responsabilidades académicas y disciplinarias, código de integralidad, puntualidad, asistencia y cuidado del entorno.',
    estimatedMinutes: 9,
    pointsReward: 180,
    completed: false,
    sections: [
      {
        id: 's3-1',
        title: '1. Deberes Académicos y Cumplimiento',
        badgeTag: 'Responsabilidad',
        keyArticles: 'Acuerdo 009/2024 - Cap. III, Deberes Académicos',
        content: [
          'Cumplir con todas las actividades, evidencias y fechas estipuladas en el cronograma de aprendizaje o en los planes de mejoramiento concertados.',
          'Asistir con puntualidad a las sesiones presenciales o sincrónicas virtuales y participar activamente en el trabajo colaborativo.',
          'Hacer uso responsable y honesto de las fuentes de información, citando adecuadamente autores bajo normas internacionales y evitando el plagio.',
          'Informar y justificar oportunamente al instructor las inasistencias por fuerza mayor médica o laboral dentro de los 3 días hábiles siguientes.'
        ],
        practicalTip: 'Si tienes incapacidad médica de tu EPS o certificación comprobable, radícala de inmediato para evitar reportes por deserción.'
      },
      {
        id: 's3-2',
        title: '2. Deberes de Convivencia y Código de Integralidad',
        badgeTag: 'Valores SENA',
        keyArticles: 'Código de Integralidad de la Función Pública SENA',
        content: [
          'Portar visiblemente el carné del SENA dentro de las instalaciones y en salidas pedagógicas o eventos autorizados.',
          'Cuidar y mantener en óptimas condiciones las instalaciones, maquinarias, laboratorios, herramientas y tecnologías del Centro.',
          'Tratar con respeto y empatía a instructores, compañeros, personal administrativo, vigilantes y personal de servicios generales.',
          'Comprometerse con el Plan de Gestión Ambiental del Centro: ahorro de agua y energía, separación en la fuente y reciclaje.'
        ],
        practicalTip: 'Los 7 valores del Código de Integralidad SENA: Honestidad, Respeto, Compromiso, Diligencia, Justicia, Solidaridad y Lealtad.'
      },
      {
        id: 's3-3',
        title: '3. Deberes en la Etapa Productiva',
        badgeTag: 'Mundo Laboral',
        keyArticles: 'Ley 789 de 2002 y Reglamento',
        content: [
          'Cumplir a cabalidad con el reglamento interno de la empresa patrocinadora o escenario de práctica.',
          'Presentar periódicamente las bitácoras quincenales o mensuales y concertar visitas de seguimiento con el instructor de seguimiento asignado.',
          'No abandonar unilateralmente el contrato de aprendizaje o práctica sin justa causa autorizada previamente por la Coordinación del SENA.'
        ],
        practicalTip: 'La terminación unilateral del contrato de aprendizaje sin autorización constituye una falta gravísima que puede cancelar tu matrícula.'
      }
    ]
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Prohibiciones y Tipificación de Faltas',
    shortTitle: 'Prohibiciones y Faltas',
    icon: 'AlertTriangle',
    summary: 'Distingue entre faltas leves, graves y gravísimas, conductas terminantemente prohibidas y sus impactos.',
    estimatedMinutes: 9,
    pointsReward: 180,
    completed: false,
    sections: [
      {
        id: 's4-1',
        title: '1. Conductas Expresamente Prohibidas',
        badgeTag: 'Límites Claros',
        keyArticles: 'Acuerdo 009/2024 - Cap. IV, Prohibiciones',
        content: [
          'Plagiar materiales, trabajos, códigos de software, diseños o evidencias creadas por otros o generadas sin declarar su fuente.',
          'Ingresar, consumir, comercializar o incitar al consumo de bebidas alcohólicas o sustancias psicoactivas en el SENA o en actividades de la institución.',
          'Portar armas de fuego, armas blancas, elementos cortopunzantes o sustancias peligrosas en el Centro de Formación.',
          'Suplantar la identidad de compañeros o instructores en plataformas virtuales (Zajuna, SofiaPlus) o presentar evaluaciones en nombre de otro.',
          'Utilizar el nombre o los logos del SENA para actividades lucrativas privadas, proselitismo político o fines ilícitos.'
        ],
        practicalTip: 'El uso de herramientas de IA es permitido para apoyo formativo cuando se declare transparentemente y no se cometa fraude evaluativo.'
      },
      {
        id: 's4-2',
        title: '2. Clasificación de las Faltas: Académicas vs Disciplinarias',
        badgeTag: 'Naturaleza de la Falta',
        keyArticles: 'Criterios de Calificación',
        content: [
          'Faltas Académicas: Relacionadas con el incumplimiento reiterado de deberes de aprendizaje, no entrega de evidencias o bajo rendimiento sin causa.',
          'Faltas Disciplinarias: Relacionadas con el comportamiento, alteración de la convivencia, irrespeto, daño a bienes o vulneración de derechos de otros.',
          'Criterios para calificar la falta: Daño causado, grado de culpabilidad (dolo o culpa), reiteración o antecedentes, ocultamiento de la falta.'
        ],
        practicalTip: 'Una misma conducta puede tener componentes académicos y disciplinarios simultáneamente (ejemplo: presentar un examen con trampa).'
      },
      {
        id: 's4-3',
        title: '3. Escala de Gravedad: Leves, Graves y Gravísimas',
        badgeTag: 'Nivel de Gravedad',
        keyArticles: 'Gradación de la Falta',
        content: [
          'Leve: Incumplimientos aislados que no causan perjuicio grave a la comunidad ni paralizan la formación (ej: una llegada tarde sin justificar).',
          'Grave: Afectación manifiesta al proceso formativo o a la convivencia, reincidencia en faltas leves o daño patrimonial culposo.',
          'Gravísima: Delitos comunes, violencia física o verbal, hurto comprobado, porte de armas, consumo/porte de estupefacientes, fraude sistemático o terminación unilateral de contrato.'
        ],
        practicalTip: 'Las faltas gravísimas dan lugar directo a Cancelación de Matrícula e inhabilidad de hasta por 2 años para volver al SENA.'
      }
    ]
  },
  {
    id: 'mod-5',
    number: 5,
    title: 'Medidas Formativas, Sanciones y Debido Proceso',
    shortTitle: 'Medidas y Sanciones',
    icon: 'Scale',
    summary: 'Aprende la diferencia vital entre medidas formativas (pedagógicas) y sanciones, y cómo opera el Comité de Evaluación.',
    estimatedMinutes: 8,
    pointsReward: 160,
    completed: false,
    sections: [
      {
        id: 's5-1',
        title: '1. Medidas Formativas: Enfoque Pedagógico, NO Sanción',
        badgeTag: 'Oportunidad de Mejora',
        keyArticles: 'Acuerdo 009/2024 - Cap. VI, Medidas Formativas',
        content: [
          'Las medidas formativas son acciones pedagógicas preventivas que buscan orientar y corregir al aprendiz sin manchar su hoja de vida académica.',
          'Llamado de atención verbal: Diálogo reflexivo del instructor con el aprendiz. NO se consigna como sanción en la plataforma.',
          'Plan de Mejoramiento Académico: Concertación de actividades pedagógicas adicionales para alcanzar resultados de aprendizaje no aprobados.',
          'Plan de Mejoramiento Disciplinario: Compromiso de cambio actitudinal o servicio a la comunidad formativa frente a dificultades comportamentales.'
        ],
        practicalTip: 'Cumplir el plan de mejoramiento con éxito deja cerrado el proceso satisfactoriamente y te mantiene al día.'
      },
      {
        id: 's5-2',
        title: '2. Sanciones Formales del SENA',
        badgeTag: 'Régimen Sancionatorio',
        keyArticles: 'Sanciones Impuestas por Subdirección',
        content: [
          'Las sanciones se aplican previo dictamen del Comité de Evaluación y Seguimiento mediante Acto Administrativo motivado del Subdirector de Centro:',
          '1. Llamado de atención escrito: Se archiva en la hoja de vida del aprendiz y puede condicionar beneficios de bienestar.',
          '2. Condicionamiento de la matrícula: Advertencia formal y pérdida temporal de incentivos. El aprendiz continúa pero ante nueva falta será cancelado.',
          '3. Cancelación de la matrícula: Máxima sanción. Pérdida del carácter de aprendiz y sanción de inhabilidad de 6 meses a 2 años en el SENA.'
        ],
        practicalTip: 'Toda sanción admite Recurso de Reposición ante el Subdirector de Centro dentro de los 5 días hábiles siguientes a la notificación.'
      },
      {
        id: 's5-3',
        title: '3. El Comité de Evaluación y Seguimiento',
        badgeTag: 'Órgano Consultor',
        keyArticles: 'Garantías Constitucionales',
        content: [
          'El Comité de Evaluación y Seguimiento está integrado por el Coordinador Académico, instructores de la ficha, representante de aprendices y orientador de bienestar.',
          'Su función es analizar objetivamente los casos remitidos, escuchar los descargos del aprendiz y formular recomendaciones técnicas al Subdirector de Centro.',
          'El aprendiz tiene derecho a presentar testigos, aportar documentos, hablar libremente y recibir comunicación formal por escrito de cada etapa.'
        ],
        practicalTip: 'Nunca faltes a una citación de comité; es tu espacio sagrado para defenderte y exponer tu verdad con tranquilidad.'
      }
    ]
  }
];

export const BADGES_DATA: Badge[] = [
  {
    id: 'badge-identidad',
    title: 'ADN SENA',
    description: 'Completaste el módulo de Identidad, Marco Normativo y Fases Formativas.',
    iconName: 'Compass',
    unlocked: false,
    requirement: 'Finaliza el Módulo 1'
  },
  {
    id: 'badge-derechos',
    title: 'Defensor de Derechos',
    description: 'Conoces tus 12 garantías fundamentales y el plan de Bienestar.',
    iconName: 'ShieldCheck',
    unlocked: false,
    requirement: 'Finaliza el Módulo 2'
  },
  {
    id: 'badge-deberes',
    title: 'Aprendiz Comprometido',
    description: 'Dominas los deberes académicos, disciplinarios y el Código de Integralidad.',
    iconName: 'BookOpenCheck',
    unlocked: false,
    requirement: 'Finaliza el Módulo 3'
  },
  {
    id: 'badge-convivencia',
    title: 'Guardián de la Convivencia',
    description: 'Distingues con precisión prohibiciones, faltas y escala de gravedad.',
    iconName: 'AlertTriangle',
    unlocked: false,
    requirement: 'Finaliza el Módulo 4'
  },
  {
    id: 'badge-debido-proceso',
    title: 'Maestro del Debido Proceso',
    description: 'Diferencias medidas formativas de sanciones y conoces el Comité de Evaluación.',
    iconName: 'Scale',
    unlocked: false,
    requirement: 'Finaliza el Módulo 5'
  },
  {
    id: 'badge-clasificador',
    title: 'Ojo Crítico Reglamentario',
    description: 'Completaste el reto de clasificación rápida sin fallas.',
    iconName: 'Zap',
    unlocked: false,
    requirement: 'Supera el minijuego de clasificación con más de 70%'
  },
  {
    id: 'badge-casos',
    title: 'Estratega Ético',
    description: 'Resolviste los 4 dilemas reales del aprendiz con criterio exemplar.',
    iconName: 'BrainCircuit',
    unlocked: false,
    requirement: 'Resuelve todos los casos prácticos'
  },
  {
    id: 'badge-certificado',
    title: 'Certificado de Honor SENA',
    description: 'Aprobaste la evaluación final de inducción con puntaje igual o superior al 80%.',
    iconName: 'Award',
    unlocked: false,
    requirement: 'Aprueba la evaluación final de certificación'
  }
];

export const CARD_SORT_ITEMS: CardSortItem[] = [
  {
    id: 'cs-1',
    text: 'Recibir oportunamente las calificaciones y retroalimentación pedagógica.',
    category: 'derecho',
    explanation: 'El aprendiz tiene la facultad de conocer el avance de sus resultados de aprendizaje y solicitar revisiones.',
    articleRef: 'Acuerdo 009/2024, Derechos Académicos'
  },
  {
    id: 'cs-2',
    text: 'Portar el carné institucional visible dentro del Centro de Formación.',
    category: 'deber',
    explanation: 'Es una obligación de seguridad y sentido de pertenencia institucional de carácter obligatorio.',
    articleRef: 'Acuerdo 009/2024, Deberes Disciplinarios'
  },
  {
    id: 'cs-3',
    text: 'Plagiar o presentar como propios trabajos o códigos elaborados por terceros.',
    category: 'prohibicion',
    explanation: 'El plagio y fraude vulnera la ética y la propiedad intelectual, tipificándose como falta grave o gravísima.',
    articleRef: 'Acuerdo 009/2024, Prohibiciones Académicas'
  },
  {
    id: 'cs-4',
    text: 'Postularse y acceder a los apoyos de sostenimiento del Plan de Bienestar.',
    category: 'derecho',
    explanation: 'Todos los aprendices que cumplan los requisitos socioeconómicos tienen derecho a competir por estos beneficios.',
    articleRef: 'Plan de Bienestar al Aprendiz'
  },
  {
    id: 'cs-5',
    text: 'Informar y justificar inasistencias médicas dentro de los 3 días hábiles siguientes.',
    category: 'deber',
    explanation: 'El aprendiz debe presentar los soportes oficiales a su instructor a tiempo para evitar deserción.',
    articleRef: 'Acuerdo 009/2024, Trámite de Justificación'
  },
  {
    id: 'cs-6',
    text: 'Ingresar o consumir bebidas embriagantes o sustancias psicoactivas en el SENA.',
    category: 'prohibicion',
    explanation: 'Atenta gravemente contra la salud y el entorno educativo; es causal de sanción gravísima.',
    articleRef: 'Acuerdo 009/2024, Prohibiciones Disciplinarias'
  },
  {
    id: 'cs-7',
    text: 'Elegir y ser elegido democráticamente como vocero de ficha o representante.',
    category: 'derecho',
    explanation: 'Garantiza la participación y el liderazgo estudiantil en todos los centros del país.',
    articleRef: 'Acuerdo 009/2024, Derechos de Representación'
  },
  {
    id: 'cs-8',
    text: 'Cuidar las maquinarias, herramientas y recursos físicos y ambientales del centro.',
    category: 'deber',
    explanation: 'El aprendiz es custodio de los bienes públicos que el Estado dispone para su aprendizaje.',
    articleRef: 'Acuerdo 009/2024, Deberes Ambientales y de Cuidado'
  },
  {
    id: 'cs-9',
    text: 'Suplantar la identidad de un compañero en la plataforma Zajuna o SofiaPlus.',
    category: 'prohibicion',
    explanation: 'La falsedad personal y suplantación de identidad informática es causal inmediata de comité y posible delito.',
    articleRef: 'Acuerdo 009/2024, Prohibiciones Informáticas'
  },
  {
    id: 'cs-10',
    text: 'Ser escuchado en descargos ante el Comité de Evaluación y Seguimiento.',
    category: 'derecho',
    explanation: 'Es la máxima expresión del Debido Proceso y el derecho de contradicción constitucional.',
    articleRef: 'Constitución Política Art. 29 y Acuerdo 009/2024'
  }
];

export const CASE_DILEMMAS: CaseDilemma[] = [
  {
    id: 'case-1',
    title: 'Inasistencia Inesperada por Urgencia de Salud',
    character: 'Camila, Aprendiz de Gestión Administrativa',
    context: 'Camila tuvo una crisis respiratoria un martes y el médico de su EPS le expidió una incapacidad médica por 3 días. No pudo asistir a las sustentaciones del proyecto formativo.',
    question: '¿Cuál es el procedimiento legal y ético que debe seguir Camila según el Reglamento?',
    articleRef: 'Acuerdo 009 de 2024 - Justificación de Inasistencias',
    teachingPoint: 'Las inasistencias deben justificarse dentro de los 3 días hábiles siguientes al reintegro con soporte de EPS o entidad facultada, concertando un plan de entrega.',
    options: [
      {
        text: 'Regresar a la semana siguiente y no decir nada, esperando que el instructor simplemente no le pregunte.',
        isBestChoice: false,
        feedback: 'Incorrecto. Acumular más de 3 días sin justificación oficial puede activar el reporte por deserción en SofiaPlus.',
        consequence: 'Riesgo de cancelación por abandono injustificado.',
        points: 0
      },
      {
        text: 'Escanear o fotografiar su incapacidad EPS y radicarla formalmente por correo a su instructor y coordinador dentro de los 3 días hábiles, solicitando acordar la fecha de entrega del proyecto.',
        isBestChoice: true,
        feedback: '¡Excelente decisión! Este es el procedimiento exacto estipulado en el reglamento, garantizando su derecho a presentar la evidencia.',
        consequence: 'El instructor programa una sesión de sustentación extraordinaria sin penalización.',
        points: 50
      },
      {
        text: 'Pedirle a una amiga que falsifique una firma médica para que no sepan que fue a esa clínica.',
        isBestChoice: false,
        feedback: 'Grave error. Falsificar documentos médicos constituye una falta gravísima con consecuencias penales y expulsión inmediata.',
        consequence: 'Remisión a Comité por falta gravísima y cancelación de matrícula.',
        points: -20
      }
    ]
  },
  {
    id: 'case-2',
    title: 'El "Atajo" del Código Copiado de Internet',
    character: 'David y Mateo, Aprendices de ADSO',
    context: 'Quedan 2 horas para entregar el aplicativo del trimestre. Mateo encuentra un repositorio de GitHub de otro año con exactamente el mismo código y propone copiarlo y cambiar solo los nombres de variables.',
    question: 'David sabe que es plagio. ¿Qué postura debe asumir David conforme a los valores SENA?',
    articleRef: 'Acuerdo 009 de 2024 - Fraude Académico y Propiedad Intelectual',
    teachingPoint: 'El plagio daña la reputación profesional del aprendiz. Es preferible solicitar un plan de mejoramiento con honestidad a cometer fraude.',
    options: [
      {
        text: 'Aceptar copiarlo rápido para asegurar la nota y prometer que nunca más lo volverán a hacer.',
        isBestChoice: false,
        feedback: 'Incorrecto. Los instructores utilizan detectores de similitud de código. El plagio conlleva la anulación y apertura de proceso disciplinario.',
        consequence: 'Calificación No Aprobado (NA) y llamado de atención escrito.',
        points: 0
      },
      {
        text: 'Negarse a plagiar, entregar lo que han construido auténticamente y solicitar al instructor un Plan de Mejoramiento Académico para completar los puntos pendientes.',
        isBestChoice: true,
        feedback: '¡Impecable! La honestidad formativa y el uso del Plan de Mejoramiento son el camino legal y ético que consagra el reglamento.',
        consequence: 'El instructor valora su honestidad y les concede un plan de mejoramiento pedagógico de 5 días.',
        points: 50
      },
      {
        text: 'Denunciar a Mateo a los gritos en el salón delante de todos para que el instructor lo expulse de inmediato.',
        isBestChoice: false,
        feedback: 'Inadecuado. La convivencia requiere diálogo constructivo inicial, respeto y canales adecuados, no agresividad pública.',
        consequence: 'Tensión en el grupo y posible falta leve de convivencia.',
        points: 10
      }
    ]
  },
  {
    id: 'case-3',
    title: 'Conflicto por Calificación con el Instructor',
    character: 'Laura, Aprendiz de Salud Ocupacional',
    context: 'Laura considera que su evidencia fue evaluada injustamente con "No Aprobado" a pesar de haber cumplido con la rúbrica y las normas técnicas.',
    question: '¿Qué mecanismo del Debido Proceso tiene Laura a su favor según el reglamento?',
    articleRef: 'Acuerdo 009 de 2024 - Derecho de Réplica y Segundo Calificador',
    teachingPoint: 'El aprendiz tiene derecho a solicitar revisión al instructor dentro de 3 días; si persiste el desacuerdo, puede solicitar un segundo calificador ante Coordinación.',
    options: [
      {
        text: 'Insultar al instructor en el grupo de WhatsApp del curso y llamar a protestar fuera del centro.',
        isBestChoice: false,
        feedback: 'Completamente inapropiado. Constituye falta disciplinaria de irrespeto y no resuelve el asunto académico.',
        consequence: 'Citación a Comité por falta disciplinaria grave.',
        points: -20
      },
      {
        text: 'Solicitar respetuosamente por escrito al instructor una sesión de retroalimentación dentro de los 3 días hábiles. Si no hay acuerdo, radicar solicitud formal de Segundo Calificador ante la Coordinación Académica.',
        isBestChoice: true,
        feedback: '¡Perfecto! Este es el conducto regular del SENA: diálogo directo primero, y si no hay acuerdo, garantía de segundo calificador designado.',
        consequence: 'Un instructor par revisa la evidencia de manera imparcial y objetiva.',
        points: 50
      },
      {
        text: 'Resignarse y asumir que no hay nada que hacer porque el instructor tiene la palabra final incuestionable.',
        isBestChoice: false,
        feedback: 'Falso. El aprendiz tiene el derecho garantizado a controvertir evaluaciones respetando el conducto regular.',
        consequence: 'Pérdida de la oportunidad de defender su resultado.',
        points: 5
      }
    ]
  },
  {
    id: 'case-4',
    title: 'La Propuesta de Retiro del Contrato de Aprendizaje',
    character: 'Santiago, en Etapa Productiva',
    context: 'Santiago lleva 2 meses en su empresa patrocinadora en Bogotá. Le ofrecieron un trabajo informal mejor pagado y decide no volver a la empresa sin avisar a nadie ni al SENA.',
    question: '¿Qué consecuencia jurídica y formativa acarrea el abandono unilateral del contrato?',
    articleRef: 'Acuerdo 009 de 2024 - Régimen de Etapa Productiva',
    teachingPoint: 'La terminación unilateral sin autorización del SENA es una falta gravísima que implica cancelación de matrícula y reporte a la plataforma de gestión de contratos.',
    options: [
      {
        text: 'No pasa nada porque el contrato de aprendizaje no tiene implicaciones serias ni sanciones en el SENA.',
        isBestChoice: false,
        feedback: 'Totalmente falso. El SENA sanciona severamente la deserción o abandono del escenario de práctica.',
        consequence: 'Cancelación de matrícula e inhabilidad para registrarse en el SENA durante 1 a 2 años.',
        points: 0
      },
      {
        text: 'Dialogar primero con el jefe inmediato y el instructor de seguimiento SENA para evaluar la situación o tramitar una cancelación de mutuo acuerdo autorizada formalmente.',
        isBestChoice: true,
        feedback: '¡Excelente! Todo cambio de empresa o novedad de etapa productiva debe contar con la concertación y aval expreso del SENA.',
        consequence: 'Se protege su historial formativo y se evita un proceso sancionatorio grave.',
        points: 50
      },
      {
        text: 'Bloquear al instructor en el celular y borrar su usuario de la plataforma.',
        isBestChoice: false,
        feedback: 'Grave error de inmadurez. El proceso administrativo continúa y la sanción queda en firme en su hoja de vida nacional.',
        consequence: 'Inhabilidad laboral y académica en el sistema nacional.',
        points: -20
      }
    ]
  }
];

export const FINAL_EXAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'falta_sancion',
    question: '¿Cuál es la principal diferencia entre una Medida Formativa y una Sanción en el SENA?',
    options: [
      'La medida formativa tiene carácter pedagógico y no constituye antecedente sancionatorio en la hoja de vida; la sanción sí.',
      'La medida formativa la impone un juez y la sanción el representante de aprendices.',
      'Ambas son idénticas y generan expulsión automática del centro.',
      'La sanción solo se aplica a los instructores y las medidas a los aprendices.'
    ],
    correctIndex: 0,
    explanation: 'Las medidas formativas (llamado verbal, planes de mejoramiento) buscan reorientar pedagógicamente sin sancionar; las sanciones son medidas formales registradas.',
    articleRef: 'Acuerdo 009 de 2024, Cap. Medidas Formativas',
    points: 10
  },
  {
    id: 'q2',
    category: 'derecho',
    question: '¿Cuántos días hábiles tiene el aprendiz para presentar soporte de justificación ante una inasistencia por fuerza mayor o salud?',
    options: [
      'Hasta 15 días después de finalizado el trimestre.',
      'Dentro de los 3 días hábiles siguientes al hecho o reintegro a la formación.',
      'No hay plazo, se puede presentar en cualquier momento antes de graduarse.',
      'Exactamente 24 horas continuas incluyendo fines de semana.'
    ],
    correctIndex: 1,
    explanation: 'El reglamento estipula claramente 3 días hábiles para radicar los soportes oficiales ante el instructor y evitar reporte por deserción.',
    articleRef: 'Acuerdo 009 de 2024, Deberes de Asistencia',
    points: 10
  },
  {
    id: 'q3',
    category: 'prohibicion',
    question: '¿Cuál de las siguientes conductas está clasificada como Falta Gravísima en el SENA?',
    options: [
      'Llegar 5 minutos tarde a una clase presencial una única vez.',
      'Portar armas de fuego, armas blancas, estupefacientes o cometer delitos en el Centro de Formación.',
      'Hacer preguntas adicionales al instructor al finalizar la clase.',
      'Olvidar traer una libreta de apuntes al taller de formación.'
    ],
    correctIndex: 1,
    explanation: 'El porte de armas, sustancias psicoactivas o actos delictivos atentan contra la vida y la seguridad, siendo faltas gravísimas que conllevan cancelación inmediata.',
    articleRef: 'Acuerdo 009 de 2024, Tipificación de Faltas',
    points: 10
  },
  {
    id: 'q4',
    category: 'derecho',
    question: 'Si un aprendiz está en desacuerdo justificado con una calificación de una evidencia, ¿cuál es su derecho inmediato?',
    options: [
      'Pintar grafitis de protesta en el Centro de Formación.',
      'Solicitar revisión respetuosa al instructor dentro de los 3 días y, de persistir desacuerdo, solicitar Segundo Calificador a Coordinación.',
      'Retirarse del programa y no volver a estudiar.',
      'Demandar penalmente a la institución al día siguiente.'
    ],
    correctIndex: 1,
    explanation: 'El debido proceso garantiza el derecho de contradicción, revisión técnica y designación de un segundo calificador imparcial.',
    articleRef: 'Acuerdo 009 de 2024, Garantías de Evaluación',
    points: 10
  },
  {
    id: 'q5',
    category: 'etapa_productiva',
    question: '¿Cuáles son algunas de las alternativas válidas reconocidas por el SENA para desarrollar la Etapa Productiva?',
    options: [
      'Únicamente quedarse en casa viendo tutoriales de YouTube.',
      'Contrato de Aprendizaje, Proyecto Productivo, Pasantía, Vínculo Laboral y Monitoría.',
      'Pagar una multa en la tesorería del SENA para homologar las horas.',
      'Trabajar exclusivamente como voluntario sin legalización institucional.'
    ],
    correctIndex: 1,
    explanation: 'El SENA ofrece diversas modalidades de etapa productiva para que cada aprendiz aplique sus competencias en entornos reales.',
    articleRef: 'Acuerdo 009 de 2024, Alternativas de Etapa Práctica',
    points: 10
  },
  {
    id: 'q6',
    category: 'deber',
    question: 'En el SENA, ¿cuál es el deber del aprendiz con respecto al carné institucional?',
    options: [
      'Guardarlo en un cajón en la casa para que no se desgaste.',
      'Portarlo en lugar visible durante su permanencia en las instalaciones y actividades formativas.',
      'Prestarlo a amigos o familiares para que entren al centro.',
      'Modificarle la foto o los datos con marcadores indelebles.'
    ],
    correctIndex: 1,
    explanation: 'El carné es un documento personal e intransferible que acredita la condición de aprendiz y debe portarse visible por seguridad institucional.',
    articleRef: 'Acuerdo 009 de 2024, Deberes del Aprendiz',
    points: 10
  },
  {
    id: 'q7',
    category: 'falta_sancion',
    question: '¿Qué es el Comité de Evaluación y Seguimiento del SENA?',
    options: [
      'Un grupo de estudiantes que organiza exclusivamente las fiestas de fin de año.',
      'El órgano asesor que analiza los casos académicos y disciplinarios de los aprendices, garantizando el debido proceso.',
      'Una empresa privada externa que contrata a los egresados.',
      'La entidad bancaria que consigna los apoyos de sostenimiento.'
    ],
    correctIndex: 1,
    explanation: 'El Comité está integrado por coordinadores, instructores y el representante de aprendices para estudiar casos y garantizar el debido proceso.',
    articleRef: 'Acuerdo 009 de 2024, Comité de Evaluación',
    points: 10
  },
  {
    id: 'q8',
    category: 'prohibicion',
    question: '¿Qué consecuencias acarrea la Cancelación de Matrícula impuesta como sanción disciplinaria?',
    options: [
      'Ninguna, el aprendiz puede inscribirse a otro programa al día siguiente.',
      'La pérdida de la calidad de aprendiz y una inhabilidad para ingresar al SENA por un período de 6 meses a 2 años.',
      'Una felicitación por escrito del Director General.',
      'El cobro de una cuota de matrícula universitaria.'
    ],
    correctIndex: 1,
    explanation: 'La cancelación de matrícula es la sanción más severa y genera una inhabilidad en el sistema institucional durante el término fijado.',
    articleRef: 'Acuerdo 009 de 2024, Sanciones Disciplinarias',
    points: 10
  },
  {
    id: 'q9',
    category: 'derecho',
    question: '¿A qué tiene derecho un aprendiz si es citado formalmente a Comité de Evaluación y Seguimiento?',
    options: [
      'A ser informado previamente de los motivos, presentar descargos, aportar pruebas y ejercer su derecho a la defensa.',
      'A no enterarse de qué lo acusan hasta el momento de la expulsión.',
      'A pagar una fianza para que se suspenda la sesión.',
      'A exigir que los instructores sean sancionados de inmediato.'
    ],
    correctIndex: 0,
    explanation: 'El derecho al debido proceso consagra la comunicación previa, el conocimiento de los hechos y la presentación de pruebas y descargos.',
    articleRef: 'Constitución Política Art. 29 y Acuerdo 009/2024',
    points: 10
  },
  {
    id: 'q10',
    category: 'deber',
    question: '¿Cuál es la responsabilidad del aprendiz respecto a los recursos ambientales en los Centros del SENA?',
    options: [
      'Dejar luces encendidas y llaves de agua abiertas para probar las tuberías.',
      'Participar en el Plan de Gestión Ambiental del Centro, usando racionalmente el agua, energía y clasificando residuos.',
      'Tirar los residuos en las zonas verdes porque son biodegradables.',
      'No tiene ninguna responsabilidad ambiental.'
    ],
    correctIndex: 1,
    explanation: 'El SENA promueve la sostenibilidad ecológica y es deber del aprendiz cooperar con el Plan de Gestión Ambiental institucional.',
    articleRef: 'Acuerdo 009 de 2024, Deberes Ambientales',
    points: 10
  }
];

export const INITIAL_STORAGE_KEY = 'sena_induction_v2_progress';
