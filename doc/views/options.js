const option1 = {
  title: {
    text: '周销售额趋势'
  },
  xAxis: {
    name: 'X',
    axisLabel: {
      style: {
        border: 1
      }
    },
    data: ['1', '2', '3', '4', '5', '6', '7']
  },
  grid: {
    left: 100,
  },
  yAxis: {
    name: 'Y',
    data: 'value',
    hoverRect: [100, 20],
    hover: true,
    // hoverRect: [20, 20],
    mouseEnter: function (event, graphic) {
      debugger;
      console.log(graphic);
    },
    axisLabel: {
      style: {
        fill: '#ffffff',
        fontSize: 25,
      },
    },
    axisTick: {
      show: true,
      style: {
        stroke: 'red',
        lineWidth: 1,
        width: 10
      }
    }
  },
  series: [
    {
      value: 'xxxxx',
      label: {
        show: true,
        position: 'right',
        offset: [0, -100],
        style: {
          fill: '#ffffff'
        }
      },
      hover: true,
      data: [2339, 1899, 2118, 1790, 3265, 4465, 3996],
      mouseEnter: function (e, graphic) {
        console.log('mouseoEnter');
        console.log(e);
        let dom = document.querySelector('#tips');
        dom.style.display = 'block';
        dom.style.left = e.x + 'px';
        dom.style.top = e.y + 'px';
        dom.innerText = `x=${e.x}, y=${e.y}`
        console.log(graphic);
      },
      mouseOuter: function (e, graphic) {
        let dom = document.querySelector('#tips');
        dom.style.display = 'none';
        dom.style.left =  '0px';
        dom.style.top =  '0px';
        dom.innerText = `x=${e.x}, y=${e.y}`;
        console.log(graphic);
      },
      // mouseMove: function (e, graphic) {
      //   let dom = document.querySelector('#tips');
      //   dom.style.left = e.x + 'px';
      //   dom.style.top = e.y + 'px';
      //   dom.innerText = `x=${e.x}, y=${e.y}`;
      // },
      type: 'bar'
    }
  ]
}


export default [option1, {}]

