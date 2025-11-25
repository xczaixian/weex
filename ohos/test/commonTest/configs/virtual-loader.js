const compiler = require('vue-template-compiler');
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const parser = require('@babel/parser')
const t = require('@babel/types');


module.exports = function (source) {
  const parsed = compiler.parseComponent(source);
  const templateAst = compiler.compile(parsed.template.content, { ast: true }).ast;
  let template = parsed.template.content;

  // 检测是否存在 virtual 属性为 true 的 list 组件
  if (template.includes('<list') && template.includes('virtual="true"')) {
    // 1. 提取 scroll 事件方法名和原始数据变量
    let scrollHandlerName = null, originalData = null;
    let estimatedItemSize_loader = 100
    let bufferScale_loader = 1
    let traverseAst = (node) => {
      if (node.tag === 'list') {
        if (node.events['scroll']) { scrollHandlerName = node.events['scroll'].value }
        if (scrollHandlerName) {
          template = template.replace(
            scrollHandlerName,
            'handleScrollProxy'
          );
        }
        if (node.attrsMap && node.attrsMap['estimatedItemSize']) {
          estimatedItemSize_loader = Number(node.attrsMap['estimatedItemSize'])
        }
        if (node.attrsMap && node.attrsMap['bufferScale']) {
          bufferScale_loader = Number(node.attrsMap['bufferScale'])
        }
      }
      if (node.attrsMap && node.attrsMap['v-for']) {
        const match = node.attrsMap['v-for'].match(/in\s+(\w+)/);
        if (match) {
          originalData = match[1]
        };
        if (originalData) {
          template = template.replace(
            originalData,
            'visibleData'
          );
        }
      }
      if (node.children) node.children.forEach(traverseAst);
    };
    traverseAst(templateAst);


    //  **************************************************  插入变量  *******************************************************

    // startIndex: 0
    const startIndexNode = t.objectProperty(
      t.identifier('startIndex'),
      t.numericLiteral(0)
    );

    // startIndex: 0
    const multipleNode = t.objectProperty(
      t.identifier('multiple'),
      t.numericLiteral(0)
    );

    // endIndex: null
    const endIndexNode = t.objectProperty(
      t.identifier('endIndex'),
      t.nullLiteral()
    );

    // 列表项预估高度 estimatedItemSize: 100
    const itemHeightNode = t.objectProperty(
      t.identifier('estimatedItemSize'),
      t.numericLiteral(estimatedItemSize_loader)
    );

    // 缓冲区比例 bufferScale:1
    const bufferScaleNode = t.objectProperty(
      t.identifier('bufferScale'),
      t.numericLiteral(bufferScale_loader)
    );

    // 可视区高度 screenHeight:0
    const screenHeightNode = t.objectProperty(
      t.identifier('screenHeight'),
      t.numericLiteral(0)
    );

    // 列表渲染后信息存储 positions:[]
    const positionsNode = t.objectProperty(
      t.identifier('positions'),
      t.arrayExpression([])
    );

    // 控制参数 ticking:false
    const tickingode = t.objectProperty(
      t.identifier('ticking'),
      t.booleanLiteral(false)
    );

    const entryDataName = [
      'startIndex',
      'estimatedItemSize',
      'bufferScale',
      'screenHeight',
      'positions',
      'tickingode',
      'endIndex',
      'multiple'
    ]
    const entryData = new Map([
      ['startIndex', startIndexNode],
      ['endIndex', endIndexNode],
      ['multiple', multipleNode],
      ['estimatedItemSize', itemHeightNode],
      ['bufferScale', bufferScaleNode],
      ['screenHeight', screenHeightNode],
      ['positions', positionsNode],
      ['tickingode', tickingode],
    ])


    // **************************************************  插入方法  *******************************************************

    // 构建 handleScrollProxy 方法
    const handleScrollProxyNode = t.objectMethod(
      'method',
      t.identifier('handleScrollProxy'),
      [t.identifier('val')],
      t.blockStatement([
        t.ifStatement(
          t.unaryExpression('!', t.memberExpression(t.thisExpression(), t.identifier('ticking'))),
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(
                t.identifier('requestAnimationFrame'),
                [
                  t.arrowFunctionExpression(
                    [],
                    t.blockStatement([
                      t.variableDeclaration('let', [
                        t.variableDeclarator(
                          t.identifier('scrollTop'),
                          t.binaryExpression(
                            '*',
                            t.unaryExpression(
                              '-',
                              t.memberExpression(
                                t.memberExpression(
                                  t.identifier('val'),
                                  t.identifier('contentOffset')
                                ),
                                t.identifier('y')
                              )
                            ),
                            t.memberExpression(t.thisExpression(), t.identifier('multiple'))
                          )
                        )
                      ]),
                      t.expressionStatement(
                        t.assignmentExpression(
                          '=',
                          t.memberExpression(t.thisExpression(), t.identifier('startIndex')),
                          t.callExpression(
                            t.memberExpression(t.thisExpression(), t.identifier('getStartIndex')),
                            [t.identifier('scrollTop')]
                          )
                        )
                      ),
                      t.expressionStatement(
                        t.assignmentExpression(
                          '=',
                          t.memberExpression(t.thisExpression(), t.identifier('endIndex')),
                          t.binaryExpression(
                            '+',
                            t.memberExpression(t.thisExpression(), t.identifier('startIndex')),
                            t.memberExpression(t.thisExpression(), t.identifier('visibleCount'))
                          )
                        )
                      ),
                      t.expressionStatement(
                        t.callExpression(
                          t.memberExpression(t.thisExpression(), t.identifier('setStartOffset')),
                          []
                        )
                      ),
                      t.expressionStatement(
                        t.assignmentExpression(
                          '=',
                          t.memberExpression(t.thisExpression(), t.identifier('ticking')),
                          t.booleanLiteral(false)
                        )
                      )
                    ])
                  )
                ])
            ),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(t.thisExpression(), t.identifier('ticking')),
                t.booleanLiteral(true)
              )
            ),
          ]),
        ),
        t.ifStatement(
          t.memberExpression(t.thisExpression(), t.identifier(`${scrollHandlerName}`)),
          t.expressionStatement(
            t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier(`${scrollHandlerName}`)),
              [t.identifier('val')]
            )
          ),
          null
        )
      ])
    )

    // initPositions方法 初始化 positions 
    const initPositionsNode = t.objectMethod(
      'method',
      t.identifier('initPositions'),
      [],
      t.blockStatement([
        t.expressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(t.thisExpression(), t.identifier('positions')),
            t.callExpression(
              t.memberExpression(t.identifier('this.' + originalData), t.identifier('map')),
              [
                t.arrowFunctionExpression(
                  [t.identifier('item'), t.identifier('index')],
                  t.objectExpression([
                    t.objectProperty(t.identifier('index'), t.identifier('index'), false, true),
                    t.objectProperty(t.identifier('height'), t.memberExpression(t.thisExpression(), t.identifier('estimatedItemSize'))),
                    t.objectProperty(t.identifier('top'), t.binaryExpression('*', t.identifier('index'), t.memberExpression(t.thisExpression(), t.identifier('estimatedItemSize')))),
                    t.objectProperty(t.identifier('bottom'), t.binaryExpression('*', t.binaryExpression('+', t.identifier('index'), t.numericLiteral(1)), t.memberExpression(t.thisExpression(), t.identifier('estimatedItemSize'))))
                  ])
                )
              ]
            )
          )
        )
      ])
    )

    //获取列表项的当前尺寸
    const updateItemsSizeNode = t.objectMethod(
      'method',
      t.identifier('updateItemsSize'),
      [],
      t.blockStatement([
        // 声明nodes变量

        t.variableDeclaration('let', [
          t.variableDeclarator(
            t.identifier('nodes'),
            t.memberExpression(
              t.thisExpression(),
              t.identifier('$refs.items')
            )
          )
        ]),
        // 遍历nodes
        t.expressionStatement(
          t.callExpression(
            t.memberExpression(
              t.identifier('nodes'),
              t.identifier('forEach')
            ),
            [
              t.arrowFunctionExpression(
                [t.identifier('node')],
                t.blockStatement([
                  // 获取rect
                  t.variableDeclaration('let', [
                    t.variableDeclarator(
                      t.identifier('rect'),
                      t.callExpression(
                        t.memberExpression(
                          t.identifier('node'),
                          t.identifier('getBoundingClientRect')
                        ),
                        []
                      )
                    )
                  ]),
                  // 计算新高度
                  t.variableDeclaration('let', [
                    t.variableDeclarator(
                      t.identifier('height'),
                      t.binaryExpression(
                        '*',
                        t.memberExpression(
                          t.identifier('rect'),
                          t.identifier('height')
                        ),
                        t.identifier('this.multiple')
                      )
                    )
                  ]),
                  // 提取索引
                  t.variableDeclaration('let', [
                    t.variableDeclarator(
                      t.identifier('index'),
                      t.unaryExpression(
                        '+',
                        t.callExpression(
                          t.memberExpression(
                            t.memberExpression(
                              t.identifier('node'),
                              t.identifier('id')
                            ),
                            t.identifier('slice')
                          ),
                          [t.numericLiteral(1)]
                        )
                      )
                    )
                  ]),
                  // 获取旧高度
                  t.variableDeclaration('let', [
                    t.variableDeclarator(
                      t.identifier('oldHeight'),
                      t.memberExpression(
                        t.memberExpression(
                          t.memberExpression(
                            t.thisExpression(),
                            t.identifier('positions')
                          ),

                          t.identifier('index'),

                          true
                        ),
                        t.identifier('height')
                      )
                    )
                  ]),
                  // 计算差值
                  t.variableDeclaration('let', [
                    t.variableDeclarator(
                      t.identifier('dValue'),
                      t.binaryExpression(
                        '-',
                        t.identifier('oldHeight'),
                        t.identifier('height')
                      )
                    )
                  ]),
                  // 判断差值是否为0
                  t.ifStatement(
                    t.binaryExpression(
                      '!==',
                      t.identifier('dValue'),
                      t.numericLiteral(0)
                    ),
                    t.blockStatement([
                      // 更新当前节点的bottom和height
                      t.expressionStatement(
                        t.assignmentExpression(
                          '=',
                          t.memberExpression(
                            t.memberExpression(
                              t.memberExpression(
                                t.thisExpression(),
                                t.identifier('positions')
                              ),
                              t.identifier('index'),
                              true
                            ),
                            t.identifier('bottom')
                          ),
                          t.binaryExpression(
                            '-',
                            t.memberExpression(
                              t.memberExpression(
                                t.memberExpression(
                                  t.thisExpression(),
                                  t.identifier('positions')
                                ),
                                t.identifier('index'),
                                true
                              ),
                              t.identifier('bottom')
                            ),
                            t.identifier('dValue')
                          )
                        )),
                      t.expressionStatement(
                        t.assignmentExpression(
                          '=',
                          t.memberExpression(
                            t.memberExpression(
                              t.memberExpression(
                                t.thisExpression(),
                                t.identifier('positions')
                              ),
                              t.identifier('index'),
                              true
                            ),
                            t.identifier('height')
                          ),
                          t.identifier('height')
                        )),
                      // 遍历后续节点
                      t.forStatement(
                        t.variableDeclaration('let', [
                          t.variableDeclarator(
                            t.identifier('k'),
                            t.binaryExpression(
                              '+',
                              t.identifier('index'),
                              t.numericLiteral(1)
                            )
                          )
                        ]),
                        t.binaryExpression(
                          '<',
                          t.identifier('k'),
                          t.memberExpression(
                            t.memberExpression(
                              t.thisExpression(),
                              t.identifier('positions')
                            ),
                            t.identifier('length')
                          )
                        ),
                        t.updateExpression(
                          '++',
                          t.identifier('k')
                        ),
                        t.blockStatement([
                          // 更新后续节点的top和bottom
                          t.expressionStatement(
                            t.assignmentExpression(
                              '=',
                              t.memberExpression(
                                t.memberExpression(
                                  t.memberExpression(
                                    t.thisExpression(),
                                    t.identifier('positions'),
                                    false,
                                    null
                                  ),
                                  t.identifier('k'),
                                  true,
                                  null
                                ),
                                t.identifier('top'),
                                false,
                                null
                              ),
                              t.memberExpression(
                                t.memberExpression(
                                  t.memberExpression(
                                    t.thisExpression(),
                                    t.identifier('positions'),
                                    false,
                                    null
                                  ),
                                  t.binaryExpression(
                                    '-',
                                    t.identifier('k'),
                                    t.numericLiteral(1)
                                  ),
                                  true,
                                  null
                                ),
                                t.identifier('bottom'),
                                false,
                                null
                              )
                            )
                          ),
                          t.expressionStatement(
                            t.assignmentExpression(
                              '=',
                              t.memberExpression(
                                t.memberExpression(
                                  t.memberExpression(
                                    t.thisExpression(),
                                    t.identifier('positions')
                                  ),
                                  t.identifier('k'),
                                  true
                                ),
                                t.identifier('bottom')
                              ),
                              t.binaryExpression(
                                '-',
                                t.memberExpression(
                                  t.memberExpression(
                                    t.memberExpression(
                                      t.thisExpression(),
                                      t.identifier('positions')
                                    ),
                                    t.identifier('k'),
                                    true
                                  ),
                                  t.identifier('bottom')
                                ),
                                t.identifier('dValue')
                              )
                            )
                          )
                        ])
                      )
                    ])
                  )
                ])
              )
            ]
          )
        )
      ])
    )

    //获取当前的偏移量
    const setStartOffsetNode = t.objectMethod(
      'method',
      t.identifier('setStartOffset'),
      [],
      t.blockStatement([
        // 声明startOffset变量
        t.variableDeclaration('let', [
          t.variableDeclarator(
            t.identifier('startOffset')
          )
        ]),
        // 判断this.start是否大于等于1
        t.ifStatement(
          t.binaryExpression(
            '>=',
            t.memberExpression(
              t.thisExpression(),
              t.identifier('startIndex')
            ),
            t.numericLiteral(1)
          ),
          t.blockStatement([
            // 计算size
            t.variableDeclaration('let', [
              t.variableDeclarator(
                t.identifier('size'),
                t.binaryExpression(
                  '-',
                  t.memberExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('positions')
                      ),
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('startIndex')
                      ),
                      true
                    ),
                    t.identifier('top')
                  ),
                  t.conditionalExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('positions')
                      ),
                      t.binaryExpression(
                        '-',
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier('startIndex')
                        ),
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier('aboveCount')
                        )
                      ),
                      true
                    ),
                    t.memberExpression(
                      t.memberExpression(
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier('positions')
                        ),
                        t.binaryExpression(
                          '-',
                          t.memberExpression(
                            t.thisExpression(),
                            t.identifier('startIndex')
                          ),
                          t.memberExpression(
                            t.thisExpression(),
                            t.identifier('aboveCount')
                          )
                        ),
                        true
                      ),
                      t.identifier('top')
                    ),
                    t.numericLiteral(0)
                  )
                )
              )
            ]),
            // 计算startOffset
            t.ExpressionStatement(
              t.assignmentExpression(
                '=',
                t.identifier('startOffset'),
                t.binaryExpression(
                  '-',
                  t.memberExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        t.identifier('positions')
                      ),
                      t.binaryExpression(
                        '-',
                        t.memberExpression(
                          t.thisExpression(),
                          t.identifier('startIndex'),
                        ),
                        t.numericLiteral(1)
                      ),
                      true
                    ),
                    t.identifier('bottom')
                  ),
                  t.identifier('size')
                )
              )
            )
          ]),
          // else分支
          t.blockStatement([
            t.ExpressionStatement(
              t.assignmentExpression(
                '=',
                t.identifier('startOffset'),
                t.numericLiteral(0)
              )
            )
          ])
        ),
        // 设置transform属性
        t.ExpressionStatement(
          t.assignmentExpression(
            '=',
            t.memberExpression(
              t.memberExpression(
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier('$refs')
                ),
                t.identifier('content')
              ),
              t.identifier('style.transform')
            ),
            t.templateLiteral([
              t.templateElement({ raw: 'translate3d(0,', cooked: 'translate3d(0,' }, false),
              t.templateElement({ raw: 'rem,0)', cooked: 'rem,0)' }, true),

            ],
              [
                t.binaryExpression(
                  '/',
                  t.identifier('startOffset'),
                  t.numericLiteral(75)
                )
              ])
          )
        )
      ])
    )


    //获取列表起始索引
    const getStartIndex = t.objectMethod(
      'method',
      t.identifier('getStartIndex'),
      [
        t.identifier('scrollTop')
      ],
      t.blockStatement([
        // 返回二分查找结果
        t.returnStatement(
          t.callExpression(
            t.memberExpression(
              t.thisExpression(),
              t.identifier('binarySearch')
            ),
            [
              t.memberExpression(
                t.thisExpression(),
                t.identifier('positions')
              ),
              t.identifier('scrollTop')
            ]
          )
        )
      ])
    )


    const binarySearchNode = t.objectMethod(
      'method',
      t.identifier('binarySearch'),
      [
        t.identifier('list'),
        t.identifier('value')
      ],
      t.blockStatement([
        // 初始化start
        t.variableDeclaration('let', [
          t.variableDeclarator(
            t.identifier('start'),
            t.numericLiteral(0)
          )
        ]),
        // 初始化end
        t.variableDeclaration('let', [
          t.variableDeclarator(
            t.identifier('end'),
            t.binaryExpression(
              '-',
              t.memberExpression(
                t.identifier('list'),
                t.identifier('length')
              ),
              t.numericLiteral(1)
            )
          )
        ]),
        // 初始化tempIndex
        t.variableDeclaration('let', [
          t.variableDeclarator(
            t.identifier('tempIndex'),
            t.nullLiteral()
          )
        ]),
        // 进入while循环
        t.whileStatement(
          t.binaryExpression(
            '<=',
            t.identifier('start'),
            t.identifier('end')
          ),
          t.blockStatement([
            // 计算midIndex
            t.variableDeclaration('let', [
              t.variableDeclarator(
                t.identifier('midIndex'),
                t.callExpression(
                  t.identifier('parseInt'),
                  [
                    t.binaryExpression(
                      '/',
                      t.binaryExpression(
                        '+',
                        t.identifier('start'),
                        t.identifier('end')
                      ),
                      t.numericLiteral(2)
                    )
                  ]
                )
              )
            ]),
            // 获取midValue
            t.variableDeclaration('let', [
              t.variableDeclarator(
                t.identifier('midValue'),
                t.memberExpression(
                  t.memberExpression(
                    t.identifier('list'),
                    t.identifier('midIndex'),
                    true
                  ),
                  t.identifier('bottom')
                )
              )
            ]),
            // 比较midValue和value
            t.ifStatement(
              t.binaryExpression(
                '===',
                t.identifier('midValue'),
                t.identifier('value')
              ),
              t.blockStatement([
                t.returnStatement(
                  t.binaryExpression(
                    '+',
                    t.identifier('midIndex'),
                    t.numericLiteral(1)
                  )
                )
              ]),
            ),
            t.IfStatement(
              t.binaryExpression(
                '<',
                t.identifier('midValue'),
                t.identifier('value')
              ),
              t.blockStatement([
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.identifier('start'),
                    t.binaryExpression(
                      '+',
                      t.identifier('midIndex'),
                      t.numericLiteral(1)
                    )
                  )
                )
              ]),
            ),

            t.IfStatement(
              t.binaryExpression(
                '>',
                t.identifier('midValue'),
                t.identifier('value')
              ),
              t.blockStatement([
                // 更新tempIndex
                t.ifStatement(
                  t.logicalExpression(
                    '||',
                    t.binaryExpression(
                      '===',
                      t.identifier('tempIndex'),
                      t.nullLiteral()
                    ),
                    t.binaryExpression(
                      '>',
                      t.identifier('tempIndex'),
                      t.identifier('midIndex')
                    )
                  ),
                  t.blockStatement([
                    t.expressionStatement(
                      t.assignmentExpression(
                        '=',
                        t.identifier('tempIndex'),
                        t.identifier('midIndex')
                      )
                    )
                  ])
                ),
                // 更新end
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.identifier('end'),
                    t.binaryExpression(
                      '-',
                      t.identifier('end'),
                      t.numericLiteral(1)
                    )
                  )
                )
              ])
            )

          ])
        ),
        // 返回tempIndex
        t.returnStatement(
          t.identifier('tempIndex')
        )
      ])
    )

    const methodsNode = [
      handleScrollProxyNode,
      initPositionsNode,
      updateItemsSizeNode,
      setStartOffsetNode,
      getStartIndex,
      binarySearchNode

    ]

    // ------------------------computed---------------------------------------

    // 可见列表项visibleCount
    const visibleCountNode = t.objectMethod(
      'method',
      t.identifier("visibleCount"),
      [],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.identifier("Math"), t.identifier("ceil")),
            [
              t.binaryExpression("/",
                t.memberExpression(t.thisExpression(), t.identifier("screenHeight")),
                t.memberExpression(t.thisExpression(), t.identifier("estimatedItemSize"))
              )
            ]
          )
        )
      ]))

    //visibleData 显示列表数据
    const visibleDataNode = t.objectMethod(
      'method',
      t.identifier("visibleData"),
      [],
      t.blockStatement([
        t.variableDeclaration("let", [
          t.variableDeclarator(
            t.identifier("start"),
            t.binaryExpression("-",
              t.memberExpression(t.thisExpression(), t.identifier("startIndex")),
              t.memberExpression(t.thisExpression(), t.identifier("aboveCount"))
            )
          )
        ]),
        t.variableDeclaration("let", [
          t.variableDeclarator(
            t.identifier("end"),
            t.binaryExpression("+",
              t.memberExpression(t.thisExpression(), t.identifier("endIndex")),
              t.memberExpression(t.thisExpression(), t.identifier("belowCount"))
            )
          )
        ]),
        t.returnStatement(
          t.callExpression(
            t.memberExpression(
              t.memberExpression(t.thisExpression(), t.identifier(originalData)),
              t.identifier("slice")
            ),
            [t.identifier("start"), t.identifier("end")]
          )
        )
      ]))


    // 可视区上方渲染条数 aboveCount
    const aboveCountNode = t.objectMethod(
      'method',
      t.identifier("aboveCount"),
      [],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.identifier("Math"), t.identifier("min")),
            [
              t.memberExpression(t.thisExpression(), t.identifier("startIndex")),
              t.binaryExpression("*",
                t.memberExpression(t.thisExpression(), t.identifier("bufferScale")),
                t.callExpression(
                  t.memberExpression(t.identifier("Math"), t.identifier("ceil")),
                  [
                    t.binaryExpression("/",
                      t.memberExpression(t.thisExpression(), t.identifier("screenHeight")),
                      t.memberExpression(t.thisExpression(), t.identifier("estimatedItemSize"))
                    )
                  ]
                )
              )
            ]
          )
        )
      ]))

    // 可视区下方渲染条数  belowCount
    const belowCountNode = t.objectMethod(
      'method',
      t.identifier("belowCount"),
      [],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.identifier("Math"), t.identifier("min")),
            [
              t.binaryExpression("-",
                t.memberExpression(t.thisExpression(), t.identifier(originalData + ".length")),
                t.memberExpression(t.thisExpression(), t.identifier("endIndex"))
              ),
              t.binaryExpression("*",
                t.memberExpression(t.thisExpression(), t.identifier("bufferScale")),
                t.callExpression(
                  t.memberExpression(t.identifier("Math"), t.identifier("ceil")),
                  [
                    t.binaryExpression("/",
                      t.memberExpression(t.thisExpression(), t.identifier("screenHeight")),
                      t.memberExpression(t.thisExpression(), t.identifier("estimatedItemSize"))
                    )
                  ]
                )
              )
            ]
          )
        )
      ]))

    // computed中计算属性
    const computedData = [visibleCountNode, visibleDataNode, aboveCountNode, belowCountNode]


    // 2. 动态注入逻辑
    const ast = parser.parse(parsed.script.content, {
      sourceType: 'module',
      plugins: ['flow']
    })


    if (scrollHandlerName && originalData) {
      traverse(ast, {
        ExportDefaultDeclaration(path) {
          const componentConfig = path.node.declaration;
          if (t.isObjectExpression(componentConfig)) {
            let createdEntry = true
            let mountedEntry = true
            let updatedEntry = true
            let methodsEntry = true
            let computedEntry = true

            componentConfig.properties.forEach(prop => {
              // 定位 data 函数
              if (t.isObjectMethod(prop) && t.isIdentifier(prop.key, { name: 'data' })) {
                const dataBody = prop.body.body;
                const returnStatement = dataBody.find(
                  node => t.isReturnStatement(node)
                );
                const dataObject = returnStatement.argument;
                if (t.isObjectExpression(dataObject)) {
                  // 检查是否已存在同名属性
                  const existingProps = dataObject.properties.map(p => p.key.name);
                  entryDataName.forEach(name => {
                    if (!existingProps.includes(name)) {
                      dataObject.properties.push(entryData.get(name));
                    }
                  });
                }
              }

              // created
              let hasCreated = false
              let createdNode = null
              componentConfig.properties.forEach(prop => {
                if (t.isIdentifier(prop.key, { name: 'created' })) {
                  hasCreated = true;
                  createdNode = prop
                }
              })
              if (!hasCreated) {
                createdNode = t.objectMethod(
                  "method",
                  t.identifier('created'),
                  [],
                  t.blockStatement([])
                )
                componentConfig.properties.splice(1, 0, createdNode)
              }

              //  再created中注入方法
              createdBody = createdNode.body.body
              // 创建左边的表达式：this.multiple
              const left = t.memberExpression(
                t.thisExpression(),
                t.identifier('multiple')
              );

              // 创建右边的表达式：75 / window.document.documentElement.style.fontSize.replace("px", "")
              const right = t.binaryExpression(
                '/',
                t.numericLiteral(75),
                t.callExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.memberExpression(
                          t.memberExpression(
                            t.identifier('window'),
                            t.identifier('document')
                          ),
                          t.identifier('documentElement')
                        ),
                        t.identifier('style')
                      ),
                      t.identifier('fontSize')
                    ),
                    t.identifier('replace')
                  ),
                  [
                    t.stringLiteral('px'),
                    t.stringLiteral('')
                  ]
                )
              );

              let createdFunctionNode = [
                t.assignmentExpression(
                  '=',
                  left,
                  right
                ),
                t.assignmentExpression(
                  '=',
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('estimatedItemSize')
                  ),
                  t.binaryExpression(
                    '*',
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('estimatedItemSize')
                    ),
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('multiple')
                    ),
                  )
                ),
                t.callExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    t.identifier('initPositions')
                  ),
                  []
                ),
              ]
              if (createdEntry) {
                createdBody.push(...createdFunctionNode)
                createdEntry = false
              }


              // 判断是否有mounted方法，如果没有，创建并注入
              let hasMounted = false
              let mountedNode = null
              componentConfig.properties.forEach(prop => {
                if (t.isIdentifier(prop.key, { name: 'mounted' })) {
                  hasMounted = true;
                  mountedNode = prop
                }
              })
              if (!hasMounted) {
                mountedNode = t.objectMethod(
                  "method",
                  t.identifier('mounted'),
                  [],
                  t.blockStatement([])
                )
                componentConfig.properties.splice(1, 0, mountedNode)
              }

              //  再mounted中注入方法
              mountedBody = mountedNode.body.body
              let mountedFunctionNode = [
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(t.thisExpression(), t.identifier('screenHeight')),
                    t.assignmentExpression(
                      "*",
                      t.memberExpression(t.identifier('window'), t.identifier('innerHeight')),
                      t.memberExpression(t.thisExpression(), t.identifier('multiple'))
                    )
                  )
                ),
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(t.thisExpression(), t.identifier('startIndex')),
                    t.numericLiteral(0)
                  ),

                ),
                t.expressionStatement(
                  t.assignmentExpression(
                    '=',
                    t.memberExpression(t.thisExpression(), t.identifier('endIndex')),
                    t.binaryExpression(
                      '+',
                      t.memberExpression(t.thisExpression(), t.identifier('startIndex')),
                      t.memberExpression(t.thisExpression(), t.identifier('visibleCount'))
                    )
                  )
                )
              ]
              if (mountedEntry) {
                mountedBody.push(...mountedFunctionNode)
                mountedEntry = false
              }

              // 判断是否有updated方法，如果没有，创建并注入
              let hasUpdated = false
              let updatedNode = null
              componentConfig.properties.forEach(prop => {
                if (t.isIdentifier(prop.key, { name: 'updated' })) {
                  hasUpdated = true;
                  updatedNode = prop
                }
              })
              if (!hasUpdated) {
                updatedNode = t.objectMethod(
                  "method",
                  t.identifier('updated'),
                  [],
                  t.blockStatement([])
                )
                componentConfig.properties.splice(1, 0, updatedNode)
              }

              //  再updated中注入方法
              updatedBody = updatedNode.body.body
              let updatedFunctionNode = [
                t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(t.thisExpression(), t.identifier('$nextTick')),
                    [
                      t.functionExpression(
                        null,
                        [],
                        t.blockStatement([
                          t.ifStatement(
                            t.logicalExpression(
                              '||',
                              t.unaryExpression(
                                '!',
                                t.memberExpression(
                                  t.memberExpression(t.thisExpression(), t.identifier('$refs')),
                                  t.identifier('items')
                                )
                              ),
                              t.unaryExpression(
                                '!',
                                t.memberExpression(
                                  t.memberExpression(
                                    t.memberExpression(t.thisExpression(), t.identifier('$refs')),
                                    t.identifier('items')
                                  ),
                                  t.identifier('length')
                                )
                              )
                            ),
                            t.blockStatement([
                              t.returnStatement()
                            ])
                          ),
                          t.expressionStatement(
                            t.callExpression(
                              t.memberExpression(t.thisExpression(), t.identifier('updateItemsSize')),
                              []
                            ),
                          ),
                          t.variableDeclaration(
                            'let',
                            [
                              t.variableDeclarator(
                                t.identifier('height'),
                                t.memberExpression(
                                  t.memberExpression(
                                    t.memberExpression(
                                      t.thisExpression(),
                                      t.identifier('positions')
                                    ),

                                    t.binaryExpression(
                                      '-',
                                      t.memberExpression(
                                        t.identifier('this.positions'),
                                        t.identifier('length')
                                      ),
                                      t.numericLiteral(1)
                                    ),
                                    true
                                  ),
                                  t.identifier('bottom')
                                )
                              )
                            ]
                          ),
                          t.expressionStatement(
                            t.assignmentExpression(
                              '=',
                              t.memberExpression(
                                t.memberExpression(
                                  t.memberExpression(
                                    t.memberExpression(t.thisExpression(), t.identifier('$refs')),
                                    t.identifier('list')
                                  ),
                                  t.identifier('style')
                                ),
                                t.identifier('height')
                              ),
                              t.binaryExpression(
                                '+',
                                t.binaryExpression(
                                  '/',
                                  t.identifier('height'),
                                  t.numericLiteral(75)
                                ),
                                t.stringLiteral('rem')
                              )
                            ),
                          ),
                          t.expressionStatement(
                            t.callExpression(
                              t.memberExpression(t.thisExpression(), t.identifier('setStartOffset')),
                              []
                            )
                          )
                        ])
                      )
                    ]
                  )
                )
              ]

              if (updatedEntry) {
                updatedEntry = false
                  updatedBody.push(...updatedFunctionNode)
              }


              // 判断是否有computed对象，如果没有，创建并注入
              let hasComputed = false
              let computedNode = null
              componentConfig.properties.forEach(prop => {
                if (t.isIdentifier(prop.key, { name: 'computed' })) {
                  hasComputed = true;
                  computedNode = prop
                }
              })
              if (!hasComputed) {
                computedNode = t.objectProperty(
                  t.identifier('computed'),
                  t.objectExpression([])
                )
                componentConfig.properties.splice(1, 0, computedNode)
              }

              computedBody = computedNode.value.properties
              if (computedEntry) {
                computedData.forEach(item => {
                  computedBody.push(item)
                })
                computedEntry = false
              }

              // 判断是否有mothods对象，如果没有，创建并注入
              let hasMethods = false
              let mothodsNode = null
              componentConfig.properties.forEach(prop => {
                if (t.isIdentifier(prop.key, { name: 'methods' })) {
                  hasMethods = true;
                  mothodsNode = prop
                }
              })
              if (!hasMethods) {
                mothodsNode = t.objectProperty(
                  t.identifier('methods'),
                  t.objectExpression([])
                )
                componentConfig.properties.splice(1, 0, mothodsNode)
              }

              // 定位到methods
              if (methodsEntry) {
                // 检查是否已存在同名方法（避免覆盖）
                methodsNode.forEach(item => {
                  mothodsNode.value.properties.push(item)
                })
                methodsEntry = false
              }
            });
          }
        }
      });

      const code = generator(ast)
      return `
      <template>${template}</template>
      <script>${code.code}</script>
      ${parsed.styles.map(s => `<style> ${s.content}</style>`).join('')}
    `;
    }
  }
  return source;
};