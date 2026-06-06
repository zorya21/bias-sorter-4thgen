let sorterItems = [];

let currentResolve = null;

let choices = [];
let replayChoices = [];
let replayIndex = 0;

let runId = 0;
let isSorting = false;

let finalRankingCache = null;


// 开始排序
function startSorter() {
    sorterItems = window.items;

    if (!sorterItems || sorterItems.length < 2) {
        alert("至少需要两个选项才可以排序！");
        return;
    }

    choices = [];
    finalRankingCache = null;

    startSortingFromCurrentChoices();
}


// 根据目前已经做过的选择，重新运行 merge sort
async function startSortingFromCurrentChoices() {
    runId++;
    let myRunId = runId;

    currentResolve = null;
    isSorting = true;

    replayChoices = choices.slice();
    replayIndex = 0;

    document.getElementById("start-page").classList.add("hidden");
    document.getElementById("result-page").classList.add("hidden");
    document.getElementById("ready-page").classList.add("hidden");
    document.getElementById("sorter-page").classList.remove("hidden");

    let groups = sorterItems.map(function(item, index) {
        return [index];
    });

    let finalRanking = await mergeSortGroups(groups, myRunId);

    if (myRunId !== runId) {
        return;
    }

    finalRankingCache = finalRanking;
    isSorting = false;

    showReadyPage();
}


// merge sort 主函数
async function mergeSortGroups(groups, myRunId) {
    if (groups.length <= 1) {
        return groups;
    }

    let middle = Math.floor(groups.length / 2);

    let left = groups.slice(0, middle);
    let right = groups.slice(middle);

    let sortedLeft = await mergeSortGroups(left, myRunId);
    let sortedRight = await mergeSortGroups(right, myRunId);

    return await mergeGroups(sortedLeft, sortedRight, myRunId);
}


// 合并两个已经排序好的数组
async function mergeGroups(left, right, myRunId) {
    let result = [];

    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        let choice = await askCompare(left[i], right[j], myRunId);

        if (myRunId !== runId) {
            return result;
        }

        if (choice === "left") {
            result.push(left[i]);
            i++;
        } else if (choice === "right") {
            result.push(right[j]);
            j++;
        } else if (choice === "both") {
            let tieGroup = left[i].concat(right[j]);
            result.push(tieGroup);
            i++;
            j++;
        }
    }

    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}


// 显示一轮比较
function askCompare(leftGroup, rightGroup, myRunId) {
    if (myRunId !== runId) {
        return null;
    }

    // 自动重放之前已经选过的答案
    if (replayIndex < replayChoices.length) {
        let oldChoice = replayChoices[replayIndex];
        replayIndex++;
        return oldChoice;
    }

    showGroup("left", leftGroup);
    showGroup("right", rightGroup);

    return new Promise(function(resolve) {
        currentResolve = function(choice) {
            if (myRunId !== runId) {
                return;
            }

            choices.push(choice);
            resolve(choice);
        };
    });
}


// 显示左边或右边
function showGroup(side, group) {
    let firstIndex = group[0];
    let firstItem = sorterItems[firstIndex];

    let imgElement = document.getElementById(side + "-img");
    let nameElement = document.getElementById(side + "-name");

    imgElement.src = "/static/images/" + firstItem.image;

    let names = group.map(function(index) {
        return sorterItems[index].name;
    }).join(" / ");

    if (group.length > 1) {
        nameElement.innerText = names + "（并列）";
    } else {
        nameElement.innerText = names;
    }
}


// 统一处理选择
function makeChoice(choice) {
    clearFocus();

    if (currentResolve) {
        let resolve = currentResolve;
        currentResolve = null;
        resolve(choice);
    }
}


// 选择左边
function chooseLeft() {
    makeChoice("left");
}


// 选择右边
function chooseRight() {
    makeChoice("right");
}


// 两个都喜欢
function chooseBoth() {
    makeChoice("both");
}


// 返回上一个选择
function undoChoice() {
    clearFocus();

    if (choices.length === 0) {
        alert("现在已经是第一个选择了，不能再返回啦！");
        return;
    }

    choices.pop();

    startSortingFromCurrentChoices();
}


// 排序完成后的中间页面
function showReadyPage() {
    document.getElementById("sorter-page").classList.add("hidden");
    document.getElementById("ready-page").classList.remove("hidden");
}


// 点击查看排名
function showFinalRanking() {
    if (!finalRankingCache) {
        return;
    }

    showResult(finalRankingCache);
}


// 显示最终结果
function showResult(finalRanking) {
    document.getElementById("ready-page").classList.add("hidden");
    document.getElementById("sorter-page").classList.add("hidden");
    document.getElementById("result-page").classList.remove("hidden");

    let resultList = document.getElementById("result-list");
    resultList.innerHTML = "";

    let rank = 1;

    finalRanking.forEach(function(group) {
        group.forEach(function(index) {
            let item = sorterItems[index];

            let div = document.createElement("div");
            div.className = "result-item";

            let rankText = "";

            if (group.length > 1) {
                rankText = "并列 #" + rank;
            } else {
                rankText = "#" + rank;
            }

            div.innerHTML = `
                <div class="rank">${rankText}</div>
                <img src="/static/images/${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                </div>
            `;

            resultList.appendChild(div);
        });

        rank = rank + group.length;
    });
}


// 重新开始
function restartSorter() {
    currentResolve = null;
    choices = [];
    replayChoices = [];
    replayIndex = 0;
    finalRankingCache = null;
    isSorting = false;

    runId++;

    document.getElementById("result-page").classList.add("hidden");
    document.getElementById("ready-page").classList.add("hidden");
    document.getElementById("sorter-page").classList.add("hidden");
    document.getElementById("start-page").classList.remove("hidden");
}


function clearFocus() {
    if (document.activeElement) {
        document.activeElement.blur();
    }
}
