import React from 'react';
import html2canvas from 'html2canvas';

class ScreenshotButton extends React.Component {
  takeScreenshot = () => {
    const element = document.getElementById('layerGroup0');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'screenshot.png';
      link.click();
    });
  };

  render() {
    return (
      <button onClick={this.takeScreenshot}>
        Take Screenshot
      </button>
    );
  }
}

export default ScreenshotButton;