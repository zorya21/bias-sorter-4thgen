from flask import Flask, render_template

app = Flask(__name__)

# 这里改成你自己的名字和图片
items = [
    {
        "name": "官俊臣",
        "image": "gjc.jpg"
    },
    {
        "name": "张桂源",
        "image": "zgy.jpg"
    },
    {
        "name": "张函瑞",
        "image": "zhr.jpg"
    },
    {
        "name": "王橹杰",
        "image": "wlj.jpg"
    },
    {
        "name": "左奇函",
        "image": "zqh.jpg"
    },
    {
        "name": "陈奕恒",
        "image": "cyh.jpg"
    },
    {
        "name": "杨博文",
        "image": "ybw.jpg"
    },
    {
        "name": "杨涵博",
        "image": "yhb.jpg"
    },
    {
        "name": "张奕然",
        "image": "zyr.jpg"
    },
    {
        "name": "聂玮辰",
        "image": "nwc.jpg"
    },
    {
        "name": "陈思罕",
        "image": "csh.jpg"
    },
    {
        "name": "魏子宸",
        "image": "wzc.jpg"
    },
    {
        "name": "李煜东",
        "image": "lyd.jpg"
    },
    {
        "name": "陈浚铭",
        "image": "cjm.jpg"
    },
    {
        "name": "王烁然",
        "image": "wsr.jpg"
    },
]

@app.route("/")
def index():
    return render_template("index.html", items=items)

if __name__ == "__main__":
    app.run(debug=True)