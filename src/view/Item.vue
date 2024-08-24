<template>
  <div class="header">
    <div class="headup">

    </div>
    <div class="headown">
      <div style="width: 30%;">
        <h4>宠物管理</h4>
      </div>
      <div style="width: 40%;">

      </div>
      <div style="width: 30%;display: flex;flex-direction: row;">
        <ElInput v-model="searchKey" placeholder="请输入搜索关键字" clearable />
        <ElButton type="primary" @click="preSearch()">搜索</ElButton>
        <ElButton type="success" >添加</ElButton>
      </div>
    </div>
  </div>
  <div>
      <ElTable :data="items" stripe="true" style="width: 100%">
          <ElTableColumn prop="itemId" label="商品ID" width="80" />
          <ElTableColumn prop="itemName" label="商品名称" width="180" />
          <ElTableColumn prop="picture" label="图片" width="120" />
          <ElTableColumn prop="stock" label="库存" width="60" />
          <ElTableColumn prop="description" label="描述" width="120" />
          <ElTableColumn prop="sell" label="销量" width="60" />
          <ElTableColumn prop="price" label="价格" width="120" />
          <ElTableColumn prop="discount" label="折扣" width="120" />
          <ElTableColumn prop="score" label="评分" width="120" />
          <ElTableColumn label="操作" width="180">
              <template #default="scope">
                  <ElButton type="primary" @click="dialogVisible=true;showDialog(scope.row)">修改</ElButton>
                  <ElButton type="danger" @click="deleteItem(scope.row.itemId,scope.row.picture)">删除</ElButton>
              </template>
          </ElTableColumn>
      </ElTable>
  </div>

  <ElDialog @close="dialogVisible = false"
            v-model="dialogVisible"
            title="修改商品信息"
            width="500">
      <ElForm label-width="80px">
        <ElFormItem label="商品名称">
          <ElInput v-model="itemName"/>
        </ElFormItem>
        <ElFormItem label="图片">
          <ElInput v-model="picture"/>
        </ElFormItem>
        <ElFormItem label="库存">
          <ElInput v-model="stock"/>
        </ElFormItem>
        <ElFormItem label="描述">
          <ElInput v-model="description"/>
        </ElFormItem>
        <ElFormItem label="销量">
          <ElInput v-model="sell"/>
        </ElFormItem>
        <ElFormItem label="价格">
          <ElInput v-model="price"/>
        </ElFormItem>
        <ElFormItem label="折扣">
          <ElInput v-model="discount"/>
        </ElFormItem>
        <ElFormItem label="评分">
          <ElInput v-model="score"/>
        </ElFormItem>
      </ElForm>
      <div style="display: flex; justify-content: center; padding: 10px;">
        <ElButton @click="dialogVisible = false; clear()">取消</ElButton>
        <ElButton type="primary" @click="dialogVisible = false; clear()">确认</ElButton>
      </div>
  </ElDialog>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { Item } from '../models/Item';
import axios from 'axios';
import { ElFormItem } from 'element-plus';

export default {
  name: 'Item',
  setup() {
  const items = ref<Item[]>([]);
  const searchKey = ref('');
  const itemName = ref('');
  const picture = ref('');
  const stock = ref<number>(0);
  const description = ref('');
  const sell = ref<number>(0);
  const price = ref<number>(0);
  const discount = ref<number>(0.0);
  const score = ref<number>(0.0);
  const itemId = ref('');
  const dialogVisible = ref(false);

  const fetchItems = async () => {
      try {
          const response = await axios.get('http://localhost:4001/diary-server/item/1/10');
          console.log('response:', response.data.data.records);
          items.value = response.data.data.records.map((itemData: any) => new Item(
              itemData.itemId,
              itemData.itemName,
              itemData.picture,
              itemData.stock,
              itemData.description,
              itemData.sell,
              itemData.price,
              itemData.discount,
              itemData.score,
          ));
          console.log('商品信息获取成功:', items);
      } catch (error) {
          console.error('获取商品信息失败:', error);
      }
  };

  const deleteItem = async (itemId: String, picture: String) => {
      try {
          const response = await axios.delete(`http://localhost:4001/diary-server/item/${itemId}/${picture}`);
          console.log('response:', response.data);
          fetchItems();
      } catch (error) {
          console.error('删除商品失败:', error);
      }
  };

  const preSearch = async () => {
    if (searchKey.value == '') {
      fetchItems();
    } else {
      searchItems();
    }
  };

  const searchItems = async () => {
    try {
      console.log('keyWord', searchKey.value == '' ? 'null' : searchKey.value);
      const response = await axios.get(`http://localhost:4001/diary-server/item/search/0/10`, {
        params: {
          'keyword': searchKey.value,
        }
      });
      console.log('keyWord', searchKey.value);
      items.value = response.data.data.records.map((itemData: any) => new Item(
              itemData.itemId,
              itemData.itemName,
              itemData.picture,
              itemData.stock,
              itemData.description,
              itemData.sell,
              itemData.price,
              itemData.discount,
              itemData.score,
          ));
      console.log('搜索成功:', items);
    } catch (error) {
      console.error('搜索用户失败:', error);
    }
  };

  const showDialog = (item: Item) => {
      itemName.value = item.itemName;
      picture.value = item.picture;
      stock.value = item.stock;
      description.value = item.description;
      sell.value = item.sell;
      price.value = item.price;
      discount.value = item.discount;
      score.value = item.score;
      itemId.value = item.itemId;
      dialogVisible.value = true;
  };

  const clear = () => {
      itemName.value = '';
      picture.value = '';
      stock.value = 0;
      description.value = '';
      sell.value = 0;
      price.value = 0;
      discount.value = 0;
      score.value = 0;
  };
  const updateItem = async () => {

  };

  onMounted(() => {
      fetchItems();
  });

  return {
      items,
      deleteItem,
      searchKey,
      searchItems,
      preSearch,
      showDialog,
      itemName,
      picture,
      stock,
      description,
      sell,
      price,
      discount,
      score,
      itemId,
      clear,
      dialogVisible,
      updateItem,
  };
},
data() {
  return {
    dialogVisible: false,
  }
}
}
</script>