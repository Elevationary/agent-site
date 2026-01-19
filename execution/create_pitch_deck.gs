function createElevationarySlides() {
  // 1. Create Presentation
  var deck = SlidesApp.create('Elevationary Presentation Template');
  
  // 2. Define Brand Colors
  var BRAND_NAVY = '#2C4773';
  var BRAND_BLUE = '#418BCB';
  var BRAND_WHITE = '#FFFFFF';
  
  // 3. Get Master
  var master = deck.getMasters()[0];
  
  // 4. Configure Background (Gradient or Solid)
  // Simple Solid Navy for Title Slide styling
  var titleLayout = master.getLayouts()[0]; // Usually Title Slide
  titleLayout.getBackground().setSolidFill(BRAND_NAVY);
  
  // 5. Configure Text Styles on Master
  // We iterate through shapes to find text boxes
  var shapes = master.getPageElements();
  shapes.forEach(function(element) {
    if (element.getPageElementType() == SlidesApp.PageElementType.SHAPE) {
      var shape = element.asShape();
      if (shape.hasText()) {
        var textRange = shape.getText();
        // Set Default Font to Arial (Fallback)
        textRange.getTextStyle().setFontFamily('Arial');
        textRange.getTextStyle().setForegroundColor(BRAND_NAVY);
      }
    }
  });

  // 6. Create Title Slide Instance
  var slide1 = deck.getSlides()[0]; // The default first slide
  // We act on the specific slide elements
  var shapes = slide1.getPageElements();
  shapes.forEach(function(element) {
     var shape = element.asShape();
     if (shape.getPlaceholderType() == SlidesApp.PlaceholderType.CENTER_TITLE) {
       shape.getText().setText("Elevationary Proposal");
       shape.getText().getTextStyle().setForegroundColor(BRAND_WHITE); // White text on Navy bg
       shape.getText().getTextStyle().setFontSize(48);
     }
     if (shape.getPlaceholderType() == SlidesApp.PlaceholderType.SUBTITLE) {
       shape.getText().setText("Transforming Non-Profits with Business Principles");
       shape.getText().getTextStyle().setForegroundColor(BRAND_BLUE);
     }
  });
  
  // Apply Navy Background to Slide 1 explicitly if Master didn't stick
  slide1.getBackground().setSolidFill(BRAND_NAVY);

  // 7. Create Content Slide
  var slide2 = deck.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
  slide2.getShapes()[0].getText().setText("Executive Summary"); // Title
  // Customizing Title Color
  slide2.getShapes()[0].getText().getTextStyle().setForegroundColor(BRAND_NAVY);
  
  Logger.log('Created Presentation: ' + deck.getUrl());
}
