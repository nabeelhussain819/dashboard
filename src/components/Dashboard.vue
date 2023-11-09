<template>
  <div class="hello p-4">
    <h1>{{ msg }}</h1>
    <div class="flex flex-wrap gap-2 justify-center w-100 my-4">
      <a-card :bordered="false" class="w-100" hoverable>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="Orders">
            <Bar :style="myStyles" id="my-chart-id"  :options="chartOptions" :data="chartData?.data" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Sales" force-render>
            <div class="w-100 items-end justify-end flex">
            <a-tooltip placement="top">
              <template #title>
                <span>Filter By Product category</span>
              </template>
                <FilterTwoTone style="font-size: 22px" v-on:click="changeValue"/>
            </a-tooltip></div>
            <Line :style="myStyles" :data="chartData?.data" :options="options" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="Invientory Trend">
            <Scatter :style="myStyles" :data="trendData?.data" :options="options" />
          </a-tab-pane>
        </a-tabs>
      </a-card>
      <a-card :bordered="false" class="w-100 pr-6" hoverable>
        <h2>RealTime</h2>
        <div class="flex items-center gap-1">
          <PlayCircleTwoTone />
          <p class="pb-1">updating live</p>
        </div>
        <a-divider />
        <div>
          <p>300+</p>
          <p>Total Orders</p>
        </div>
        <a-divider />
        <div>
          <p>300+</p>
          <p>Sales</p>
        </div>
        <a-divider />
        <div>
          <p>300+</p>
          <p>Revenue</p>
        </div>
      </a-card>
    </div>
      <a-card :bordered="false"  hoverable>
    <a-list item-layout="horizontal" :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        >
          <template #title>
            <a href="https://www.antdv.com/">{{ item.title }}</a>
          </template>
          <template #avatar>
            <a-avatar :size="52" shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
  </a-card>
  </div>
</template>

<script>
import { Chart as ChartJS, Title, Tooltip, Filler, RadialLinearScale, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,
  PointElement,
  LineElement, RadialLinearScale, Filler)
import {
  PlayCircleTwoTone, FilterTwoTone
} from '@ant-design/icons-vue';
import { Bar, Line, Scatter } from 'vue-chartjs'
import * as chartConfig from './constants/ChartConfig'
import * as trendChart from './constants/TrendChart.js'
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];
export default {
  name: 'DashboardView',
  components: {
    PlayCircleTwoTone,
    FilterTwoTone,
    Bar,
    Line,
    Scatter
  },
  data() {
    return { chartData: chartConfig, trendData: trendChart }
  },
  setup() {
    return {
      data,
    };
  },
  computed: {
    myStyles() {
      return {
        height: `300px`,
        width: `1000px`,
        position: 'relative'
      }
    },
  },
  methods: {
    changeValue() {
      this.chartData = chartConfig.data
    }
  },
  props: {
    msg: String
  }
}
</script>

