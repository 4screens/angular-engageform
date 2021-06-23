import QuizQuestion from '../../api/quiz-question.interface'
import Result from '../../api/result.interface'
import Engageform from '../../engageform/engageform'
import Case from '../case'
import Page from '../page'
import { PageType } from '../page-type.enum'
import SliderCase from "../case/slider";

export default class Slider extends Page {
  readonly type = PageType.Slider

  result = 0

  minValue?: number
  maxValue?: number
  valueLabel?: string
  valueLabelOption?: string
  labelTypeOption?: string
  color?: string
  highlightColor?: string
  barColor?: string
  minLabel?: string
  midLabel?: string
  maxLabel?: string
  sliderData?: any

  selectedValue: number = 0

  shouldShowResults(): boolean {
    return this.settings.showResults && this.result > 0
  }

  constructor(engageform: Engageform, data: QuizQuestion) {
    super(engageform, data)

    this.minValue = 0
    this.maxValue = 100

    if (data.settings.slider) {
      this.minValue = data.settings.slider.minValue
      this.maxValue = data.settings.slider.maxValue
      this.valueLabel = data.settings.slider.valueLabel
      this.valueLabelOption = data.settings.slider.valueLabelOption
      this.labelTypeOption = data.settings.slider.labelTypeOption
      this.color = data.settings.slider.color
      this.highlightColor = data.settings.slider.highlightColor
      this.barColor = data.settings.slider.barColor
      this.minLabel = data.settings.slider.minLabel
      this.midLabel = data.settings.slider.midLabel
      this.maxLabel = data.settings.slider.maxLabel

      var resultColor, dark, modelColor;
      var colorOne = this.hexToRgba(data.settings.slider.highlightColor);
      var colorTwo = this.formBrightnessColor(parseFloat(engageform.theme.backgroundBrightness));

      if (colorOne && colorTwo) {
        resultColor = this.sumTwoColors(colorOne, colorTwo);
        dark = this.isTextDark(resultColor[0], resultColor[1], resultColor[2], resultColor[3]);
        modelColor = dark ? '#454545' : '#eee';
      }

      this.sliderData = {
        floor: data.settings.slider.minValue,
        ceil: data.settings.slider.maxValue,
        startValue: data.settings.slider.startValue,
        step: data.settings.slider.step,
        showSelectionBar: true,
        customTemplateScope: {
          barColor: data.settings.slider.barColor,
          labelFont: engageform.theme.font,
          labelColor: data.settings.slider.color,
          labelBackground: data.settings.slider.highlightColor,
          valueColor: modelColor
        },
        translate: function(val: string, label: string, which: string) {
          if (which === 'model') {
            if (data.settings.slider.valueLabelOption === 'suffix') {
              return val + ' ' + data.settings.slider.valueLabel;
            } else if (data.settings.slider.valueLabelOption === 'prefix') {
              return data.settings.slider.valueLabel + ' ' + val;
            } else {
              return val;
            }
          }

          if (data.settings.slider.labelTypeOption === 'label') {
            return val;
          } else {
            return '';
          }
        },
        getSelectionBarColor: function() {
          return data.settings.slider.highlightColor;
        },
        getPointerColor: function() {
          return data.settings.slider.highlightColor;
        },
        onEnd: function(sliderId: string, modelValue: string, highValue: any, pointerType: string) {
          return { sliderId, modelValue, highValue, pointerType };
        }
      }
    }

    this.cases = [this.createCase((this.minValue || 0))];

    this.sent().then(sent => {
      if (sent.selectedValue) {
        this.selectedValue = sent.selectedValue
        this.selectAnswer(sent)
      }
    })
  }

  createCase(ordinal: number): Case {
    return new SliderCase(this, {ordinal})
  }

  selectAnswer(sent: any) {
    if (sent.selectedValue) {
      this.filled = true
      this.selectedValue = sent.selectedValue
    }

    if (sent.result) {
      this.result = sent.result
    }

    this.cases.map((vcase: Case) => {
      vcase.selected = sent.selectedValue >= (vcase as SliderCase).ordinal

      if (sent.selectedValue === (vcase as SliderCase).ordinal) {
        this.engageform.sendAnswerCallback(this.engageform.title || this.engageform.id,
          this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null,
          vcase)
      }
    })
  }

  setResults(results: Result) {
    this.result = results.average || 0
    this.selectedValue = results.average || 0
  }

  formBrightnessColor(brightness: number) {
    if (brightness < 50) {
      return [0, 0, 0, 1 - (brightness * 2 / 100)];
    } else {
      return [255, 255, 255, (brightness - 50) * 2 / 100];
    }
  }

  hexToRgba(hex: any) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      1
    ] : null;
  };

  isTextDark(red: any, green: any, blue: any, opacity: any) {
    var brightness;

    brightness = (red * 299) + (green * 587) + (blue * 114);
    brightness = brightness / 1000;

    return (brightness > 125 || (opacity && opacity < 0.6));
  };

  sumTwoColors(colorTwo: any, colorOne: any) {
    // Pointer-Duff algorythm http://keithp.com/~keithp/porterduff/p253-porter.pdf
    var opacity = colorOne[3] + colorTwo[3] * (1 - colorOne[3]);
    var red = (colorOne[0] * colorOne[3] + colorTwo[0] * colorTwo[3] * (1 - colorOne[3])) / opacity;
    var green = (colorOne[1] * colorOne[3] + colorTwo[1] * colorTwo[3] * (1 - colorOne[3])) / opacity;
    var blue = (colorOne[2] * colorOne[3] + colorTwo[2] * colorTwo[3] * (1 - colorOne[3])) / opacity;

    return [Math.round(red), Math.round(green), Math.round(blue), opacity];
  };
}
