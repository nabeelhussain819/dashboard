<template>
  <a-spin :spinning="!productChartData?.products">
    <div class="hello p-2">
      <h1 class="my-4">{{ msg }}</h1>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-card :bordered="false" class="w-100" hoverable>
            <a-tabs v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="Orders">
                <Bar :style="myStyles" id="my-chart-id" :options="options" :data="{
                  labels: productChartData?.products?.map((data) => data.title),
                  datasets: [
                    {
                      label: 'Stock',
                      backgroundColor: '#3a60739f',
                      data: productChartData?.products?.map((data) => Math.round(data.rating))
                    }
                  ]
                }" />
              </a-tab-pane>
              <a-tab-pane key="2" tab="Sales" force-render>
                <div class="w-100 items-end justify-end flex">
                  <a-tooltip placement="top">
                    <template #title>
                      <span>Filter By Product category</span>
                    </template>
                    <a-dropdown :trigger="['click']">
                      <a class="ant-dropdown-link" @click.prevent>
                        <FilterTwoTone style="font-size: 22px" v-on:click="changeValue" />
                        <DownOutlined />
                      </a>
                      <template #overlay>
                        <a-menu>
                          <a-menu-item v-for="(cat, index) in orderChartData" :value="cat" :key="index">{{ cat }}
                          </a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </a-tooltip>

                </div>
                <Line :style="myStyles" :data="salesData" />
              </a-tab-pane>
              <a-tab-pane key="3" tab="Invientory Trend">
                <Bar :style="myStyles" id="my-chart-id" :options="options" :data="{
                  labels: productChartData?.products?.map((data) => data.title),
                  datasets: [
                    {
                      label: 'Stock',
                      backgroundColor: '#3a60739f',
                      data: productChartData?.products?.map((data) => data.stock)
                    }
                  ]
                }" />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false" class="w-100 pr-6" hoverable>
            <h2>RealTime</h2>
            <div class="flex items-center gap-1">
              <PlayCircleTwoTone />
              <p class="pb-1">updating live</p>
            </div>
            <a-divider />
            <div>
              <p>{{ productChartData?.products?.reduce((sum, data) => sum + Math.round(data.rating || 0), 0) }}</p>
              <p>Total Orders</p>
            </div>
            <a-divider />
            <div>
              <p>112+</p>
              <p>Sales</p>
            </div>
            <a-divider />
            <div>
              <p>${{ productChartData?.products?.reduce((sum, data) => sum + (data.price || 0), 0) }}</p>
              <p>Revenue</p>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-card :bordered="false" hoverable class="mt-4 h-[448px] overflow-y-auto" title="Products of this Year">
        <a-list item-layout="horizontal" :data-source="productChartData.products">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :description="item.description">
                <template #title>
                  <a href="https://www.antdv.com/">{{ item.title }}</a>
                </template>
                <template #avatar>
                  <a-avatar :size="52" shape="square" :src="item.thumbnail" />
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>
  </a-spin>
</template>

<script>
import { Chart as ChartJS, Title, Tooltip, Filler, RadialLinearScale, Legend, BarElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,
  PointElement,
  LineElement, RadialLinearScale, Filler)
import {
  PlayCircleTwoTone, FilterTwoTone
} from '@ant-design/icons-vue';
import { Bar, Line } from 'vue-chartjs'
import * as chartConfig from './constants/ChartConfig'
import * as trendChart from './constants/TrendChart.js'
import { ref } from 'vue';
import { onMounted } from 'vue';
import axios from 'axios';
const productChartData = ref([]);
const orderChartData = ref([]);

const visible = ref(false);

export default {
  name: 'DashboardView',
  components: {
    PlayCircleTwoTone,
    Bar,
    Line,
    FilterTwoTone
  },
  data() {
    return { chartData: chartConfig, trendData: trendChart }
  },
  setup() {
    const handleMenuClick = () => {
      visible.value = false;
    };
    const getProductData = async () => {
      const response = await axios.get('https://dummyjson.com/products?limit=12');
      productChartData.value = response.data || [];
    }
    const getCategory = async () => {
      const response = await axios.get(`https://dummyjson.com/products/categories`);
      orderChartData.value = response.data || [];
    }
    onMounted(() => {
      getProductData();
      getCategory()
    });
    const options = {
      responsive: true,
      maintainAspectRatio: false
    }
    const salesData = {
      labels: ['daily', 'weekly', 'monthly', 'yearly'
      ],
      datasets: [
        {
          label: 'Sales',
          backgroundColor: '#3a60739f',
          data: [22, 49, 38, 112],
        }
      ]
    }
    return {
      handleMenuClick,
      visible,
      productChartData,
      orderChartData,
      options,
      salesData
    };
  },
  computed: {
    myStyles() {
      return {
        height: `300px`,
        width: `1200px`,
        position: 'relative'
      }
    },
  },
  props: {
    msg: String
  }
}
</script>

