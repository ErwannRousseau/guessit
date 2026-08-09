import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/erwannrousseau/Developer/guessit/outputs/019fcf61-98a2-74b1-b2af-9164c5c52bb0";
const previewDir = "/Users/erwannrousseau/Developer/guessit/tmp/workbook/previews";
const sourcePdf = "/Users/erwannrousseau/Downloads/Test_Valves_Bateau.pdf";

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Synthèse");
const equipment = workbook.worksheets.add("Équipements");
const observations = workbook.worksheets.add("Observations");
const reference = workbook.worksheets.add("Référentiel");
const sources = workbook.worksheets.add("Sources");

const colors = {
  navy: "#17365D",
  blue: "#D9EAF7",
  blue2: "#EAF3F8",
  teal: "#1F6D7A",
  paleTeal: "#E5F2F3",
  orange: "#FCE4D6",
  red: "#F4CCCC",
  green: "#D9EAD3",
  gray: "#F3F6F8",
  border: "#B7C9D6",
  text: "#1F2933",
};

const sourceNote = `Document source: Test_Valves_Bateau.pdf (local PDF, 3 pages). Données fictives selon le document.`;
const genericObservation = "Inspection visuelle préalable; contrôle des joints; vérification des couples de serrage; absence de corrosion avancée; essais d'ouverture et de fermeture; validation de l'étanchéité après remise en service.";
const observationText = "Ce rapport est destiné à des essais de lecture automatique de documents. Chaque vanne possède un identifiant unique, un système associé, une pression nominale, un diamètre nominal, un matériau de fabrication ainsi qu'un historique d'inspection. Les informations présentées sont fictives et servent uniquement à valider des traitements de texte, d'extraction de tableaux, de classification et de recherche sémantique. Une inspection visuelle est supposée avoir été réalisée avant toute intervention. Les remarques de maintenance incluent le contrôle des joints, la vérification des couples de serrage, l'absence de corrosion avancée, les essais d'ouverture et de fermeture ainsi que la validation de l'étanchéité après remise en service.";

const valves = [
  ["VLV-001", "Valve", "Ballast", "Papillon", 150, 16, "Acier inox", "Pont B - Frame 12", "OK", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
  ["VLV-002", "Valve", "Refroidissement", "Boisseau", 80, 25, "Bronze", "Salle des machines", "Inspection", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
  ["VLV-003", "Valve", "Incendie", "Opercule", 100, 16, "Fonte ductile", "Pont C", "OK", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
  ["VLV-004", "Valve", "Carburant", "Bille", 50, 40, "Acier carbone", "Réservoir tribord", "À remplacer", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
  ["VLV-005", "Valve", "Eau douce", "Membrane", 65, 10, "PVC", "Local technique", "OK", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
  ["VLV-006", "Valve", "Hydraulique", "Aiguille", 25, 250, "Inox 316", "Treuil avant", "OK", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
  ["VLV-007", "Valve", "Ventilation", "Clapet", 200, 6, "Aluminium", "Conduit principal", "Inspection", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
  ["VLV-008", "Valve", "Huile", "Soupape", 40, 63, "Inox", "Salle machines", "OK", null, genericObservation, "Sections 1 à 5", 1, sourcePdf],
];

function titleBand(sheet, range, title, subtitleRange, subtitle) {
  sheet.getRange(range).merge();
  sheet.getRange(range.split(":")[0]).values = [[title]];
  sheet.getRange(range).format = {
    fill: colors.navy,
    font: { bold: true, color: "#FFFFFF", size: 16 },
    horizontalAlignment: "center",
    verticalAlignment: "center",
  };
  sheet.getRange(range).format.rowHeight = 30;
  sheet.getRange(subtitleRange).merge();
  sheet.getRange(subtitleRange.split(":")[0]).values = [[subtitle]];
  sheet.getRange(subtitleRange).format = {
    fill: colors.blue2,
    font: { italic: true, color: colors.text, size: 10 },
    wrapText: true,
    verticalAlignment: "center",
  };
  sheet.getRange(subtitleRange).format.rowHeight = 28;
}

function headerStyle(range) {
  range.format = {
    fill: colors.teal,
    font: { bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "outside", style: "thin", color: colors.border },
  };
  range.format.rowHeight = 28;
}

function tableStyle(table) {
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  table.showBandedRows = true;
}

// Synthèse
summary.showGridLines = false;
titleBand(summary, "A1:K1", "Registre centralisé - équipements du bateau", "A2:K2", `${sourceNote} La structure accepte de futurs instruments ou matériels, même si le PDF ne contient ici que des vannes.`);
summary.getRange("A4:L4").values = [["Total équipements", null, "Vannes", null, "À remplacer", null, "Inspection", null, "DN max (mm)", null, "PN max (bar)", null]];
summary.getRange("A4:L4").format = { fill: colors.blue, font: { bold: true, color: colors.navy }, horizontalAlignment: "center", verticalAlignment: "center" };
summary.getRange("A5").formulas = [["=COUNTA('Équipements'!$A$5:$A$12)"]];
summary.getRange("C5").formulas = [["=COUNTIF('Équipements'!$B$5:$B$12,\"Valve\")"]];
summary.getRange("E5").formulas = [["=COUNTIF('Équipements'!$I$5:$I$12,\"À remplacer\")"]];
summary.getRange("G5").formulas = [["=COUNTIF('Équipements'!$I$5:$I$12,\"Inspection\")"]];
summary.getRange("I5").formulas = [["=MAX('Équipements'!$E$5:$E$12)"]];
summary.getRange("K5").formulas = [["=MAX('Équipements'!$F$5:$F$12)"]];
summary.getRange("A5:L5").format = { fill: "#FFFFFF", font: { bold: true, color: colors.navy, size: 14 }, horizontalAlignment: "center", verticalAlignment: "center", borders: { preset: "outside", style: "thin", color: colors.border } };
summary.getRange("A5:L5").format.rowHeight = 30;

summary.getRange("A8:C8").values = [["État source", "Nombre", "Lecture opérationnelle"]];
headerStyle(summary.getRange("A8:C8"));
summary.getRange("A9:C11").values = [["OK", null, "Aucune action immédiate"], ["Inspection", null, "Programmer inspection"], ["À remplacer", null, "Planifier le remplacement"]];
summary.getRange("B9").formulas = [["=COUNTIF('Équipements'!$I$5:$I$12,A9)"]];
summary.getRange("B9:B11").fillDown();
summary.getRange("A9:C11").format = { borders: { preset: "outside", style: "thin", color: colors.border }, wrapText: true, verticalAlignment: "center" };
summary.getRange("A9:A11").conditionalFormats.add("containsText", { text: "OK", format: { fill: colors.green } });
summary.getRange("A9:A11").conditionalFormats.add("containsText", { text: "Inspection", format: { fill: colors.orange } });
summary.getRange("A9:A11").conditionalFormats.add("containsText", { text: "À remplacer", format: { fill: colors.red } });

summary.getRange("E8:G8").values = [["Indicateur", "Valeur", "Source / note"]];
headerStyle(summary.getRange("E8:G8"));
summary.getRange("E9:G12").values = [
  ["Systèmes couverts", null, "Un système par vanne dans le tableau source"],
  ["Matériaux distincts", null, "Dénomination conservée telle qu'extraite"],
  ["Observations détaillées", null, "Sections 1 à 5, portée générale"],
  ["Pages du PDF", 3, "Métadonnée du document source"],
];
summary.getRange("F9").formulas = [["=COUNTA('Référentiel'!$B$5:$B$12)"]];
summary.getRange("F10").formulas = [["=COUNTA('Référentiel'!$B$16:$B$23)"]];
summary.getRange("F11").formulas = [["=COUNTA('Observations'!$A$5:$A$9)"]];
summary.getRange("E9:G12").format = { borders: { preset: "outside", style: "thin", color: colors.border }, wrapText: true, verticalAlignment: "center" };

summary.getRange("A15:K15").merge();
summary.getRange("A15").values = [["Priorités à suivre"]];
summary.getRange("A15:K15").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "left" };
summary.getRange("A16:K18").values = [
  ["VLV-004", "Carburant", "À remplacer", "Réservoir tribord", "Action prioritaire: planifier le remplacement.", null, null, null, null, null, null],
  ["VLV-002", "Refroidissement", "Inspection", "Salle des machines", "Programmer une inspection.", null, null, null, null, null, null],
  ["VLV-007", "Ventilation", "Inspection", "Conduit principal", "Programmer une inspection.", null, null, null, null, null, null],
];
summary.getRange("A16:E18").format = { borders: { preset: "outside", style: "thin", color: colors.border }, wrapText: true, verticalAlignment: "center" };
summary.getRange("A16:K18").format.rowHeight = 30;
summary.getRange("A16:E16").format.fill = colors.red;
summary.getRange("A17:E18").format.fill = colors.orange;
summary.getRange("A20:K20").merge();
summary.getRange("A20").values = [["Limite de source: les observations sont génériques et ne donnent pas un historique distinct par identifiant; elles sont donc rattachées à toutes les vannes avec la mention Sections 1 à 5."]];
summary.getRange("A20:K20").format = { fill: colors.gray, font: { italic: true, color: colors.text }, wrapText: true, verticalAlignment: "center" };
summary.getRange("A20:K20").format.rowHeight = 36;
summary.getRange("A:A").format.columnWidth = 18;
summary.getRange("B:B").format.columnWidth = 13;
summary.getRange("C:C").format.columnWidth = 18;
summary.getRange("D:D").format.columnWidth = 13;
summary.getRange("E:E").format.columnWidth = 22;
summary.getRange("F:F").format.columnWidth = 12;
summary.getRange("G:G").format.columnWidth = 22;
summary.getRange("H:H").format.columnWidth = 12;
summary.getRange("I:I").format.columnWidth = 15;
summary.getRange("J:J").format.columnWidth = 12;
summary.getRange("K:K").format.columnWidth = 18;
summary.freezePanes.freezeRows(4);

// Équipements
equipment.showGridLines = false;
titleBand(equipment, "A1:N1", "Équipements - registre détaillé", "A2:N2", "Une ligne par équipement. Les colonnes J (action) et les synthèses sont calculées à partir des valeurs saisies dans ce registre.");
const equipmentHeaders = ["ID", "Catégorie", "Système", "Type", "DN (mm)", "PN (bar)", "Matériau", "Position", "État (source)", "Action recommandée", "Observations globales", "Sections source", "Page source", "Fichier source"];
equipment.getRange("A4:N4").values = [equipmentHeaders];
headerStyle(equipment.getRange("A4:N4"));
equipment.getRange("A5:N12").values = valves;
equipment.getRange("J5").formulas = [["=IF(I5=\"À remplacer\",\"Planifier le remplacement\",IF(I5=\"Inspection\",\"Programmer inspection\",\"Aucune action immédiate\"))"]];
equipment.getRange("J5:J12").fillDown();
equipment.getRange("A5:N12").format = { borders: { preset: "outside", style: "thin", color: colors.border }, verticalAlignment: "center" };
equipment.getRange("A4:N12").format.borders = { preset: "all", style: "thin", color: "#000000" };
equipment.getRange("E5:F12").format.numberFormat = "#,##0";
equipment.getRange("J5:K12").format.wrapText = true;
equipment.getRange("N5:N12").format.wrapText = true;
equipment.getRange("A5:N12").format.rowHeight = 52;
equipment.getRange("I5:I12").conditionalFormats.add("containsText", { text: "OK", format: { fill: colors.green } });
equipment.getRange("I5:I12").conditionalFormats.add("containsText", { text: "Inspection", format: { fill: colors.orange } });
equipment.getRange("I5:I12").conditionalFormats.add("containsText", { text: "À remplacer", format: { fill: colors.red, font: { bold: true } } });
equipment.getRange("J5:J12").conditionalFormats.add("containsText", { text: "remplacement", format: { fill: colors.red } });
equipment.getRange("J5:J12").conditionalFormats.add("containsText", { text: "inspection", format: { fill: colors.orange } });
const equipmentTable = equipment.tables.add("A4:N12", true, "EquipementsTable");
tableStyle(equipmentTable);
equipment.getRange("A:A").format.columnWidth = 12;
equipment.getRange("B:B").format.columnWidth = 14;
equipment.getRange("C:C").format.columnWidth = 18;
equipment.getRange("D:D").format.columnWidth = 14;
equipment.getRange("E:F").format.columnWidth = 10;
equipment.getRange("G:G").format.columnWidth = 16;
equipment.getRange("H:H").format.columnWidth = 22;
equipment.getRange("I:I").format.columnWidth = 15;
equipment.getRange("J:J").format.columnWidth = 24;
equipment.getRange("K:K").format.columnWidth = 58;
equipment.getRange("L:L").format.columnWidth = 22;
equipment.getRange("M:M").format.columnWidth = 12;
equipment.getRange("N:N").format.columnWidth = 48;
equipment.freezePanes.freezeRows(4);

// Observations
observations.showGridLines = false;
titleBand(observations, "A1:E1", "Observations du document source", "A2:E2", "Les cinq sections sont conservées séparément. Leur portée est générale: le PDF ne fournit pas de texte spécifique à un ID de vanne.");
observations.getRange("A4:E4").values = [["Section", "Portée", "Texte centralisé", "Pages", "Fichier source"]];
headerStyle(observations.getRange("A4:E4"));
observations.getRange("A5:E9").values = [
  ["Section 1", "Toutes les vannes", observationText, "1", sourcePdf],
  ["Section 2", "Toutes les vannes", observationText, "1-2", sourcePdf],
  ["Section 3", "Toutes les vannes", observationText, "2", sourcePdf],
  ["Section 4", "Toutes les vannes", observationText, "2", sourcePdf],
  ["Section 5", "Toutes les vannes", observationText, "2-3", sourcePdf],
];
observations.getRange("A5:E9").format = { borders: { preset: "outside", style: "thin", color: colors.border }, wrapText: true, verticalAlignment: "top" };
observations.getRange("A5:E9").format.rowHeight = 118;
const observationsTable = observations.tables.add("A4:E9", true, "ObservationsTable");
tableStyle(observationsTable);
observations.getRange("A:A").format.columnWidth = 14;
observations.getRange("B:B").format.columnWidth = 20;
observations.getRange("C:C").format.columnWidth = 96;
observations.getRange("D:D").format.columnWidth = 10;
observations.getRange("E:E").format.columnWidth = 48;
observations.freezePanes.freezeRows(4);

// Référentiel
reference.showGridLines = false;
titleBand(reference, "A1:E1", "Référentiel de recherche", "A2:E2", "Valeurs extraites du tableau des vannes. Les comptages se recalculent si le registre est complété avec d'autres équipements.");
reference.getRange("A4:E4").values = [["Catégorie", "Valeur", "Type de référence", "Nombre", "Note"]];
headerStyle(reference.getRange("A4:E4"));
const systems = ["Ballast", "Refroidissement", "Incendie", "Carburant", "Eau douce", "Hydraulique", "Ventilation", "Huile"];
const materials = ["Acier inox", "Bronze", "Fonte ductile", "Acier carbone", "PVC", "Inox 316", "Aluminium", "Inox"];
const statuses = ["OK", "Inspection", "À remplacer"];
reference.getRange("A5:E12").values = systems.map((v) => ["Valve", v, "Système", null, "Extrait du champ Système"]);
reference.getRange("D5").formulas = [["=COUNTIF('Équipements'!$C$5:$C$12,B5)"]];
reference.getRange("D5:D12").fillDown();
reference.getRange("A16:E23").values = materials.map((v) => ["Valve", v, "Matériau", null, "Extrait du champ Matériau"]);
reference.getRange("D16").formulas = [["=COUNTIF('Équipements'!$G$5:$G$12,B16)"]];
reference.getRange("D16:D23").fillDown();
reference.getRange("A27:E29").values = statuses.map((v) => ["Valve", v, "État source", null, "Valeur de statut du PDF"]);
reference.getRange("D27").formulas = [["=COUNTIF('Équipements'!$I$5:$I$12,B27)"]];
reference.getRange("D27:D29").fillDown();
reference.getRange("A14:E14").merge();
reference.getRange("A14").values = [["Matériaux"]];
reference.getRange("A14:E14").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF" } };
reference.getRange("A25:E25").merge();
reference.getRange("A25").values = [["États"]];
reference.getRange("A25:E25").format = { fill: colors.navy, font: { bold: true, color: "#FFFFFF" } };
for (const range of ["A5:E12", "A16:E23", "A27:E29"]) {
  reference.getRange(range).format = { borders: { preset: "outside", style: "thin", color: colors.border }, verticalAlignment: "center" };
}
reference.getRange("A:A").format.columnWidth = 14;
reference.getRange("B:B").format.columnWidth = 22;
reference.getRange("C:C").format.columnWidth = 18;
reference.getRange("D:D").format.columnWidth = 12;
reference.getRange("E:E").format.columnWidth = 34;
reference.freezePanes.freezeRows(4);

// Sources
sources.showGridLines = false;
titleBand(sources, "A1:B1", "Sources et notes d'audit", "A2:B2", "Traçabilité minimale de l'extraction et limites d'interprétation.");
sources.getRange("A4:B4").values = [["Champ", "Valeur"]];
headerStyle(sources.getRange("A4:B4"));
sources.getRange("A5:B12").values = [
  ["Fichier source", sourcePdf],
  ["Pages", 3],
  ["Titre", "Rapport de test - Inventaire de vannes de bateau"],
  ["Nature", "Document fictif généré pour des tests de parsing PDF; données inventées."],
  ["Tableau principal", "Page 1: 8 vannes, colonnes ID, Système, Type, DN, PN, Matériau, Position, État."],
  ["Observations", "Sections 1 à 5: texte générique répété, porté par toutes les vannes."],
  ["Instruments distincts", "Aucun instrument autre qu'une valve n'est listé dans le PDF."],
  ["Extension", "La colonne Catégorie permet d'ajouter d'autres équipements sans changer le modèle."],
];
sources.getRange("A5:B12").format = { borders: { preset: "outside", style: "thin", color: colors.border }, wrapText: true, verticalAlignment: "top" };
sources.getRange("A5:B12").format.rowHeight = 34;
sources.getRange("A:A").format.columnWidth = 24;
sources.getRange("B:B").format.columnWidth = 105;
sources.freezePanes.freezeRows(4);

// Render all sheets for visual QA.
for (const sheetName of ["Synthèse", "Équipements", "Observations", "Référentiel", "Sources"]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${previewDir}/${sheetName.replaceAll("é", "e").replaceAll("è", "e")}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const check = await workbook.inspect({ kind: "table", range: "Synthèse!A1:K20", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 12, maxChars: 9000 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 300 }, summary: "final formula error scan" });
console.log(errors.ndjson);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/registre_equipements_bateau.xlsx`);
console.log(`EXPORTED ${outputDir}/registre_equipements_bateau.xlsx`);
