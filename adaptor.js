var ThirdpartyLib;
(function (ThirdpartyLib) {
    var StringNewsServer = (function () {
        function StringNewsServer() {
        }
        StringNewsServer.prototype.getString = function () {
            /* validate userName and passWord then */
            return "StringNewsServer.newsItem1;StringNewsServer.newsItem2;StringNewsServer.newsItem3";
        };
        return StringNewsServer;
    })();
    ThirdpartyLib.StringNewsServer = StringNewsServer;
    var ArrayNewsServer = (function () {
        function ArrayNewsServer() {
        }
        ArrayNewsServer.prototype.getArray = function () {
            /* use url to fetch data then */
            return ["ArrayNewsServer.newsItem1", "ArrayNewsServer.newsItem2", "ArrayNewsServer.newsItem3"];
        };
        return ArrayNewsServer;
    })();
    ThirdpartyLib.ArrayNewsServer = ArrayNewsServer;
})(ThirdpartyLib || (ThirdpartyLib = {}));
var News;
(function (News) {
    var NewsLoader = (function () {
        function NewsLoader() {
        }
        NewsLoader.prototype.Load = function (server) {
            var news = server.getNews();
            news.forEach(function (value) {
                console.log(value);
            });
        };
        return NewsLoader;
    })();
    News.NewsLoader = NewsLoader;
    var StringNewsServerAdapter = (function () {
        function StringNewsServerAdapter() {
            this.newsServer = new ThirdpartyLib.StringNewsServer();
            this.newsServer.userName = "userName";
            this.newsServer.passWord = "passWord";
        }
        StringNewsServerAdapter.prototype.getNews = function () {
            var items = this.newsServer.getString();
            return items.split(";");
        };
        return StringNewsServerAdapter;
    })();
    News.StringNewsServerAdapter = StringNewsServerAdapter;
    var ArrayNewsServerAdapter = (function () {
        function ArrayNewsServerAdapter() {
            this.newsServer = new ThirdpartyLib.ArrayNewsServer();
            this.newsServer.url = "http://mynews.com";
        }
        ArrayNewsServerAdapter.prototype.getNews = function () {
            return this.newsServer.getArray();
        };
        return ArrayNewsServerAdapter;
    })();
    News.ArrayNewsServerAdapter = ArrayNewsServerAdapter;
    var newsLoader = new NewsLoader();
    var arrayNewsServer = new ArrayNewsServerAdapter();
    newsLoader.Load(arrayNewsServer);
    var stringNewsServer = new StringNewsServerAdapter();
    newsLoader.Load(stringNewsServer);
})(News || (News = {}));
