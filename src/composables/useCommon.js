import { reactive, ref } from "vue";
import { toast } from "@/composables/util";

// 列表数据 分页 搜索
export function useInitTable(opt = {}) {
  const tableData = ref([]);
  const totalCount = ref(0);
  const currentPage = ref(1);
  const loading = ref(false);

  let searchForm = null;
  function resetSearchForm() {}

  if (opt.TempSearchForm) {
    searchForm = reactive({ ...opt.TempSearchForm });

    resetSearchForm = function () {
      for (const key in searchForm) {
        searchForm[key] = opt.TempSearchForm[key];
      }
    };
  }

  function getData() {
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        // console.log(res);
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          totalCount.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  getData();

  function pageChange(val) {
    currentPage.value = val;
    getData();
  }

  return {
    tableData,
    totalCount,
    currentPage,
    loading,
    searchForm,
    resetSearchForm,
    getData,
    pageChange,
  };
}

// 表单 增、改
export function useInitForm(opt = {}) {
  const formDrawerRef = ref(null);

  const handleEdit = (row) => {
    // titleType.value = "修改公告";
    subId.value = row.id;
    for (const key in ruleForm) {
      ruleForm[key] = row[key];
    }
    // console.log(ruleForm, row);

    formDrawerRef.value.openDrawer();
  };

  const handleCreate = () => {
    // titleType.value = "新增公告";
    subId.value = 0;
    for (const key in opt.TempRuleForm) {
      ruleForm[key] = opt.TempRuleForm[key];
    }
    formDrawerRef.value.openDrawer();
    // console.log(ruleForm, opt.TempRuleForm);
  };
  const subId = ref(0);
  const ruleFormRef = ref(null);
  const ruleForm = reactive({ ...opt.TempRuleForm });
  const rules = reactive({ ...(opt.TempRules || "") });

  function handleSubmit() {
    // console.log(ruleForm);
    ruleFormRef.value.validate((valid) => {
      if (!valid) return;
      formDrawerRef.value.loading = true;

      let body = {};
      if (opt.beforeSubmit && typeof opt.beforeSubmit == "function") {
        body = opt.beforeSubmit({ ...ruleForm });
      } else {
        body = ruleForm;
      }
      let temp = subId.value ? opt.update(subId.value, body) : opt.create(body);
      temp
        .then((res) => {
          // console.log(res);
          subId.value ? toast("修改成功") : toast("新增成功");
          opt.getData();
        })
        .catch(() => {
          subId.value ? toast("修改失败", "error") : toast("新增失败", "error");
        })
        .finally(() => {
          formDrawerRef.value.loading = false;
          formDrawerRef.value.closeDrawer();
        });
    });
  }

  return {
    formDrawerRef,
    handleEdit,
    handleCreate,
    ruleFormRef,
    ruleForm,
    rules,
    subId,
    handleSubmit,
  };
}

// 表单 删、状态修改
export function useInitForm2(opt = {}) {
  const handleStatusChange = (status, row) => {
    // console.log(status, row);
    row.statusLoading = true;
    opt
      .updateStatus(row.id, status)
      .then((res) => {
        // console.log(res);
        toast("修改成功");

        row.status = status;
      })
      .catch(() => {
        toast("修改失败", "error");
      })
      .finally(() => {
        row.statusLoading = false;
      });
  };

  const handleDelete = (row) => {
    // console.log(row);
    opt
      .delete(row.id)
      .then((res) => {
        toast("删除成功");
        opt.getData();
      })
      .catch((err) => {
        console.log(err);
        toast("删除失败", "error");
      });
  };

  // 批量删除
  const ids = ref([]);
  const multipleTableRef = ref(null);
  function handleSelectionChange(e) {
    // console.log(e);
    ids.value = e.map((item) => item.id);
    // console.log(ids.value);
  }
  function handleMultiDelete() {
    // console.log(ids.value.length);
    if (ids.value.length == 0) {
      toast("至少选择一个规格", "error");
      return;
    }
    opt
      .delete(ids.value)
      .then(() => {
        toast("删除成功");
        ids.value.length = 0;
        opt.getData();
      })
      .catch((e) => {
        // console.log(e);
        toast("删除失败", "error");
      })
      .finally(() => {
        // 清空用户选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
      });
  }

  // 批量修改状态
  function handleMultiStatusChange(status) {
    // console.log(ids.value.length);
    if (ids.value.length == 0) {
      toast("至少选择一个规格", "error");
      return;
    }
    opt
      .updateStatus(ids.value, status)
      .then(() => {
        status ? toast("上架成功") : toast("下架成功");
        // 清空用户选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }
        ids.value.length = 0;
        opt.getData();
      })
      .catch((e) => {
        // console.log(e);
        status ? toast("上架失败") : toast("下架失败");
      });
  }

  return {
    ids,
    handleStatusChange,
    handleDelete,
    multipleTableRef,
    handleSelectionChange,
    handleMultiDelete,
    handleMultiStatusChange,
  };
}
