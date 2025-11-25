<template>
<div>
    <!-- <list class="list-wrap" v-grouping-child-elements="5">
            <cell class="list-cell" v-for="(item, smart_index) in lists" :key="item">
                <text class="item" @click='onstart(item, smart_index)'>{{ `${item}--${smart_index}` }}</text>
            </cell>
        </list>
        <button class="btn" @click="addInfo">添加数据</button> -->
    <!-- <list class="list-wrap" v-grouping-child-elements="5">
        <div>**************分组内层嵌套**************</div>
        <div v-if="true">
            <cell class="list-cell" v-for="(item, smart_index) in lists" :key="item">
                <text class="item" @click='onstart(item, smart_index)'>{{ `${item}--${smart_index}` }}</text>
            </cell>
        </div>
        <div class="list-wrap" v-grouping-child-elements="3">
            <cell class="list-cell" v-for="(item, big_index) in lists_fork" :key="item">
                <text class="item" @click='onstart(item, big_index)'>{{ `${item}--${big_index}` }}</text>
            </cell>
        </div>
    </list> -->
    <!-- <list class="list-wrap" v-grouping-child-elements="5">
            <button class="btn" @click="showList">展示list内容</button>
            <div>**************内层嵌套且含v-if**************</div>
            <div v-if="isHarmony">
                <cell class="list-cell" v-for="(item, smart_index) in lists" :key="item">
                    <text class="item" @click='onstart(item, smart_index)'>{{ `${item}--${smart_index}` }}</text>
                </cell>
            </div>
        </list>
        <list class="list-wrap">
            <div>**************内层嵌套且含v-if**************</div>
            <button class="btn" @click="showList">展示list内容</button>
            <div v-if="isHarmony" v-grouping-child-elements="5">
                <cell class="list-cell" v-for="(item, smart_index) in lists" :key="item">
                    <text class="item" @click='onstart(item, smart_index)'>{{ `${item}--${smart_index}` }}</text>
                </cell>
            </div>
        </list>
        <list class="list-wrap">
            <div>**************内层嵌套且含v-show**************</div>
            <button class="btn" @click="showList">展示list内容</button>
            <div v-show="isHarmony" v-grouping-child-elements="5">
                <cell class="list-cell" v-for="(item, smart_index) in lists" :key="item">
                    <text class="item" @click='onstart(item, smart_index)'>{{ `${item}--${smart_index}` }}</text>
                </cell>
            </div>
        </list>
        <list class="list-wrap" v-grouping-child-elements="3">
            <div v-for="(classItem, classIndex) in classes" :key="classIndex">
                <h2>{{ classItem.name }}</h2>
                <ul>
                    <li v-for="(student, studentIndex) in classItem.students" v-grouping-child-ignore="true" :key="studentIndex">
                        <h3>{{ student.name }}</h3>
                        <ul>
                            <li v-for="(subject, subjectIndex) in student.subjects" v-grouping-child-ignore :key="subjectIndex">
                                {{ subject.name }}: {{ subject.score }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </list> -->
    <list class="list-wrap" v-grouping-child-elements="50">
        <div>**************Hit Test1**************</div>
        <cell class="list-cell" v-for="(item, smart_index) in 10000" :key="item">
            <text class="item" @click='onstart(lists[smart_index % lists.length], smart_index)'>{{ `${lists[smart_index % lists.length]}--${smart_index}` }}</text>
        </cell>
    </list>
    <!-- <list class="list-wrap" v-grouping-child-elements="50">
        <div>**************Hit Test2**************</div>
        <button class="btn" @click="showList">展示list内容</button>
        <div v-if="isHarmony">
            <cell class="list-cell" v-for="(item, smart_index) in 10000" :key="item">
                <text class="item" @click='onstart(lists[smart_index % lists.length], smart_index)'>{{ `${lists[smart_index % lists.length]}--${smart_index}` }}</text>
            </cell>
        </div>
    </list>
    <list class="list-wrap">
        <div>**************Hit Test3**************</div>
        <button class="btn" @click="showList">展示list内容</button>
        <div v-if="isHarmony" v-grouping-child-elements="50">
            <cell class="list-cell" v-for="(item, smart_index) in 10000" :key="item">
                <text class="item" @click='onstart(lists[smart_index % lists.length], smart_index)'>{{ `${lists[smart_index % lists.length]}--${smart_index}` }}</text>
            </cell>
        </div>
    </list> -->
</div>
</template>

    
<script>
export default {
    data() {
        return {
            lists: [
                "pretty",
                "large",
                "big",
                "small",
                "tall",
                "short",
                "long",
                "handsome",
                "plain",
                "quaint",
                "clean",
                "elegant",
                "easy",
                "angry",
                "crazy",
                "helpful",
                "mushy",
                "odd",
                "unsightly",
                "adorable",
                "important",
                "inexpensive",
                "cheap",
                "expensive",
                "fancy",
            ],
            lists_fork: [
                "pretty",
                "large",
                "big",
                "small",
                "tall",
                "short",
                "long",
                "handsome",
                "plain",
                "quaint",
                "clean",
                "elegant",
                "easy",
                "angry",
                "crazy",
                "helpful",
                "mushy",
                "odd",
                "unsightly",
                "adorable",
                "important",
                "inexpensive",
                "cheap",
                "expensive",
                "fancy",
            ],
            classes: [{
                    name: "Class 1",
                    students: [{
                            name: "Alice",
                            subjects: [{
                                    name: "Math",
                                    score: 90,
                                },
                                {
                                    name: "English",
                                    score: 85,
                                },
                            ],
                        },
                        {
                            name: "Bob",
                            subjects: [{
                                    name: "Math",
                                    score: 80,
                                },
                                {
                                    name: "English",
                                    score: 75,
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Class 2",
                    students: [{
                            name: "Charlie",
                            subjects: [{
                                    name: "Math",
                                    score: 95,
                                },
                                {
                                    name: "English",
                                    score: 88,
                                },
                            ],
                        },
                        {
                            name: "David",
                            subjects: [{
                                    name: "Math",
                                    score: 70,
                                },
                                {
                                    name: "English",
                                    score: 78,
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Class 3",
                    students: [{
                            name: "Charlie",
                            subjects: [{
                                    name: "Math",
                                    score: 95,
                                },
                                {
                                    name: "English",
                                    score: 88,
                                },
                            ],
                        },
                        {
                            name: "David",
                            subjects: [{
                                    name: "Math",
                                    score: 70,
                                },
                                {
                                    name: "English",
                                    score: 78,
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "Class 4",
                    students: [{
                            name: "Charlie",
                            subjects: [{
                                    name: "Math",
                                    score: 95,
                                },
                                {
                                    name: "English",
                                    score: 88,
                                },
                            ],
                        },
                        {
                            name: "David",
                            subjects: [{
                                    name: "Math",
                                    score: 70,
                                },
                                {
                                    name: "English",
                                    score: 78,
                                },
                            ],
                        },
                    ],
                },
            ],
            isHarmony: false,
        };
    },
    methods: {
        onstart(item, index) {
            console.log(`${item}---${index}`);
        },
        showList() {
            this.isHarmony = true;
        },
        addInfo() {
            console.log("button anniu");
            this.lists.push(
                ...[
                    "pretty",
                    "large",
                    "big",
                    "small",
                    "tall",
                    "short",
                    "long",
                    "handsome",
                    "plain",
                    "quaint",
                    "clean",
                    "elegant",
                    "easy",
                    "angry",
                    "crazy",
                    "helpful",
                    "mushy",
                    "odd",
                    "unsightly",
                    "adorable",
                    "important",
                    "inexpensive",
                    "cheap",
                    "expensive",
                    "fancy",
                ]
            );
        },
    },
};
</script>

    
<style>
.btn {
    width: 500px;
    padding: 20px;
    margin: 20px auto 0;
    border-radius: 10px;
    color: #6d7dff;
    text-align: center;
    font-size: 32px;
    border-style: solid;
    border-color: #6d7dff;
    border-width: 1px;
    opacity: 1;
}

.list-wrap {
    width: 750px;
    flex: 1;
    background-color: aliceblue;
}

.list-cell {
    width: 100%;
    margin-bottom: 20px;
}

.item {
    width: 750px;
    height: 50px;
    background-color: red;
}
</style>
