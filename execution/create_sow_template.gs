function createElevationarySOW() {
  // 1. Create the Document
  var doc = DocumentApp.create('Elevationary SOW Template');
  var body = doc.getBody();
  
  // 2. Setup Margins (1 inch = 72 points)
  // Default is usually 72, but enforcing it ensures consistency
  body.setMarginTop(72);
  body.setMarginBottom(72);
  body.setMarginLeft(72);
  body.setMarginRight(72);

  // 3. Define Brand Colors (From brand_style.md)
  var BRAND_NAVY = '#2C4773';
  var BRAND_BLUE = '#418BCB';
  var BRAND_TEAL = '#1B5F7F';
  var DARK_TEXT = '#1E1C32';

  // 4. Configure Styles
  // Note: Docs API 'setHeadingAttributes' is limited, so we often have to apply manually or use defined styles
  // We will define specific attributes objects to apply to paragraphs
  
  var styleNormal = {};
  styleNormal[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
  styleNormal[DocumentApp.Attribute.FONT_SIZE] = 11;
  styleNormal[DocumentApp.Attribute.FOREGROUND_COLOR] = DARK_TEXT;

  var styleH1 = {};
  styleH1[DocumentApp.Attribute.FONT_FAMILY] = 'Arial'; # Fallback for Absolut Pro
  styleH1[DocumentApp.Attribute.FONT_SIZE] = 20;
  styleH1[DocumentApp.Attribute.BOLD] = true;
  styleH1[DocumentApp.Attribute.FOREGROUND_COLOR] = BRAND_NAVY;

  var styleH2 = {};
  styleH2[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
  styleH2[DocumentApp.Attribute.FONT_SIZE] = 16;
  styleH2[DocumentApp.Attribute.BOLD] = true;
  styleH2[DocumentApp.Attribute.FOREGROUND_COLOR] = BRAND_BLUE;

  // 5. Setup Header
  var header = doc.addHeader();
  var headerPara = header.appendParagraph("SOW: [CLIENT NAME] | Elevationary");
  headerPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  headerPara.getAttributes(); 
  headerPara.setForegroundColor('#808080'); // Grey for header
  headerPara.setFontFamily('Arial');

  // 6. Setup Footer
  var footer = doc.addFooter();
  var footerPara = footer.appendParagraph("Confidential and Proprietary");
  footerPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  footerPara.setForegroundColor('#808080');
  footerPara.setFontSize(9);
  footerPara.setFontFamily('Arial');

  // 7. Add Dummy Content to visualize styles
  var pTitle = body.appendParagraph("Statement of Work");
  pTitle.setHeading(DocumentApp.ParagraphHeading.TITLE);
  pTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  pTitle.setFontFamily('Arial');
  pTitle.setForegroundColor(BRAND_NAVY);

  body.appendParagraph(""); // Spacer

  var pH1 = body.appendParagraph("1. Project Overview");
  pH1.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  pH1.setAttributes(styleH1);

  var pNormal = body.appendParagraph("This Statement of Work (\"SOW\") is entered into by and between Elevationary and [Client Name]. This document outlines the scope, deliverables, and timeline for the engagement.");
  pNormal.setAttributes(styleNormal);

  var pH2 = body.appendParagraph("1.1 Objectives");
  pH2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  pH2.setAttributes(styleH2);

  body.appendParagraph("The primary objectives of this project are:").setAttributes(styleNormal);
  body.appendListItem("Objective 1: ...").setAttributes(styleNormal);
  body.appendListItem("Objective 2: ...").setAttributes(styleNormal);

  // 8. Log URL
  Logger.log('Created Document: ' + doc.getUrl());
}
