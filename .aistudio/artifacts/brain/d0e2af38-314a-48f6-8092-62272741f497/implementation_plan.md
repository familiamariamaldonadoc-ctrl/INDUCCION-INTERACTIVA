# Plan de Implementación: Sincronización Automática y Silenciosa con Google Sheets

Este plan define la arquitectura y el flujo técnico para que el prototipo de inducción SENA registre y actualice automáticamente a los aprendices en Google Sheets en segundo plano, sin requerir intervención manual constante ni mostrar alertas intrusivas.

---

## 1. Decisiones Confirmadas con el Usuario

En base a tus preferencias seleccionadas:
* **Disparador de sincronización:** Se ejecutará de forma automática en cada hito clave del aprendiz:
  1. Al guardar o actualizar los datos del perfil (nombre, documento, ficha, programa, regional).
  2. Al completar cualquiera de los módulos de aprendizaje (inducción, bienestar, reglamento, etc.).
  3. Al aprobar la evaluación final y obtener la certificación.
* **Experiencia en pantalla (UI):** **Completamente silenciosa**. El proceso se ejecuta en segundo plano sin toasts, alertas de carga ni interrupciones visuales, manteniendo la inmersión del aprendiz.
* **Estructura de datos en Google Sheets:** **Una fila por aprendiz actualizada en tiempo real**. El sistema buscará la fila correspondiente al número de documento del aprendiz:
  * Si el aprendiz ya existe en la hoja, actualizará sus columnas de progreso, porcentaje y estado en su misma fila.
  * Si es un nuevo aprendiz, agregará una nueva fila respetando el formato y estilo verde SENA (`#39A900`).

---

## 2. Arquitectura de Sincronización Desatendida

```
┌─────────────────────────────────────────────────────────────┐
│                 EVENTOS DE HITO DEL APRENDIZ                │
│   • Perfil Guardado   • Módulo Completado   • Examen Final  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             COLA DE FONDO (Debounced Sync Queue)            │
│  - Agrupa cambios rápidos para no saturar la API de Sheets  │
│  - Recupera de forma transparente el Sheet ID y Token       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Llamada silenciosa en segundo plano)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               GOOGLE SHEETS API v4 / DRIVE API              │
│  1. Lee columna de Documentos (ID único)                    │
│  2. Si existe: UPDATE Fila específica (Progreso, Módulos, Nota)
│  3. Si es nuevo: APPEND Fila con estilo SENA institucional  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de la Hoja de Cálculo

La hoja de cálculo (`Registro de Aprendices - Inducción SENA`) mantendrá las siguientes columnas ordenadas:

| Columna | Nombre | Descripción |
|---|---|---|
| **A** | `Tipo Documento` | CC, TI, CE, PEP, PPT |
| **B** | `Número Documento` | Clave única de búsqueda para actualizar la fila |
| **C** | `Nombre Completo` | Nombres y apellidos del aprendiz |
| **D** | `Correo Electrónico` | Correo de contacto |
| **E** | `Teléfono` | Teléfono de contacto |
| **F** | `Regional` | Regional SENA asignada |
| **G** | `Centro de Formación` | Centro de formación |
| **H** | `Programa de Formación`| Nombre del programa |
| **I** | `Número de Ficha` | Ficha de caracterización |
| **J** | `Estado Inducción` | `En Progreso` o `Certificado` |
| **K** | `Progreso (%)` | Porcentaje de avance calculado (0% - 100%) |
| **L** | `Módulos Completados` | Cantidad de módulos finalizados (ej: 4/4) |
| **M** | `Calificación Examen` | Nota obtenida (ej: 92/100) |
| **N** | `Fecha Certificación` | Fecha de expedición del certificado |
| **O** | `Última Actualización` | Marca de tiempo automática de sincronización |

---

## 4. Plan de Trabajo Fase por Fase

### Fase 1: Motor de Sincronización Automática (`googleSheetsService.ts`)
* Implementar una función de cola con *debounce* (espera de 1.5s para consolidar cambios) que evite bloqueos por cuota de Google Sheets API.
* Implementar detección y persistencia automática del `spreadsheetId` activo en almacenamiento seguro (`localStorage`), de modo que no se solicite reconectar ni configurar en cada recarga.
* Implementar la lógica de consulta (Lookup) por Documento para actualizar la fila correspondiente (`PUT spreadsheets.values`) o añadir una nueva (`POST spreadsheets.values:append`).

### Fase 2: Conexión de Disparadores en Hitos (`App.tsx` y Componentes)
* **Hito 1 - Perfil:** En `handleSaveProfile`, disparar la sincronización silenciosa del aprendiz en cuanto complete o modifique su información personal.
* **Hito 2 - Módulos:** En `completeModule`, registrar inmediatamente el incremento de módulos completados y nuevo porcentaje de progreso.
* **Hito 3 - Examen y Certificación:** En `handleFinishExam` (cuando el puntaje sea aprobatorio) y en la generación de certificado, actualizar el estado a `Certificado`, registrar la nota y la fecha.

### Fase 3: Modo Silencioso y Tolerancia a Fallos
* Suprimir cualquier modal, toast emergente o spinner bloqueante durante la sincronización automática.
* Manejo silencioso de errores: si la red falla temporalmente o el token expira, el sistema guarda el estado localmente y reintenta de fondo en la siguiente interacción sin interrumpir al usuario.
* Mantener la opción en el panel administrativo de consultar la hoja o forzar sincronización manual solo si el instructor lo desea expresamente.

### Fase 4: Validación y Pruebas
* Validar la compilación con `compile_applet` y linteo con `lint_applet`.
* Comprobar que al avanzar un módulo o actualizar el perfil, la hoja de cálculo refleje el cambio de manera desatendida.
