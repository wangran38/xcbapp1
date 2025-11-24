"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const utils_public = require("../../utils/public.js");
const _sfc_main = {
  mixins: [utils_public.myMixin],
  data() {
    return {
      posts: [],
      queryData: {
        page: 1,
        limit: 10
      }
    };
  },
  computed: {
    timelineGroups() {
      return this.posts.reduce((groups, post) => {
        const date = this.initDate(post.created);
        groups[date] = groups[date] || [];
        groups[date].push(post);
        return groups;
      }, {});
    }
  },
  async onLoad(pramas) {
    if (pramas.id) {
      this.queryData.farmersgoods_id = parseInt(pramas.id);
    }
    this.getData();
  },
  methods: {
    viewImage(url) {
      common_vendor.index.previewImage({
        showmenu: false,
        urls: [url]
      });
    },
    async getData() {
      let data = await api_index.api.dynamicsDataList(this.queryData);
      if (data.code == 200) {
        let newList = data.data.listdata.map((item) => {
          if (!item["imgs"])
            return item;
          item["imgs"] = item["imgs"].split(",");
          let initData = item["imgs"].map((anlien) => {
            if (anlien.slice(anlien.length - 3) == "mp4") {
              return {
                fileType: "video",
                path: anlien
              };
            } else {
              return {
                fileType: "image",
                path: anlien
              };
            }
          });
          item["imgs"] = initData;
          return item;
        });
        this.posts = [...this.posts, ...newList];
        this.noMore = newList.length < this.queryData.limit;
      }
    },
    loadMore() {
      if (!this.noMore) {
        this.queryData.page++;
        this.getData();
      }
    },
    toggleReaction(index) {
      const post = this.posts[index];
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    },
    previewMedia(url) {
      common_vendor.index.previewImage({
        urls: [url]
      });
    },
    createPost() {
      common_vendor.index.navigateTo({
        url: "/pages/post/create"
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($options.timelineGroups, (group, date, i0) => {
      return {
        a: common_vendor.t(date),
        b: common_vendor.f(group, (post, index, i1) => {
          return {
            a: common_vendor.t(_ctx.initTime(post.created)),
            b: common_vendor.t(post.farmersgoodsname),
            c: common_vendor.f(post.imgs, (item, idx, i2) => {
              return common_vendor.e({
                a: item.fileType === "image"
              }, item.fileType === "image" ? {
                b: item.path,
                c: common_vendor.o(($event) => $options.viewImage(item.path), idx)
              } : {
                d: item.path
              }, {
                e: idx
              });
            }),
            d: common_vendor.t(post.content),
            e: "e92d2579-0-" + i0 + "-" + i1,
            f: common_vendor.p({
              type: post.liked ? "heart-filled" : "heart",
              color: post.liked ? "#FF6B6B" : "#7A9D7E",
              size: "20"
            }),
            g: common_vendor.t(post.likes),
            h: common_vendor.o(($event) => $options.toggleReaction(post.id), index),
            i: "e92d2579-1-" + i0 + "-" + i1,
            j: common_vendor.t(post.comments),
            k: index
          };
        }),
        c: date
      };
    }),
    b: common_vendor.p({
      type: "chat",
      color: "#7A9D7E",
      size: "20"
    }),
    c: $data.posts.length <= 0
  }, $data.posts.length <= 0 ? {} : {}, {
    d: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e92d2579"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/dynamics/dynamics.js.map
