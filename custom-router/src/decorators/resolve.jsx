import React from 'react'

/**
 * HOC装饰器，用于异步数据获取时的状态管理
 * @param resolve 获取异步数据的过程函数，参数为未包装时组件可以获得的props，期望返回Promise类型以判断异步任务状态
 * @param options 可选的HOC额外参数，内详
 * @returns HOC 包装后的组件
 */
export default (resolve, options = {}) => (InnerComponent) => {
  /**
   * key 若key为String或String Array，@resolve内部会对每一个key在props内求值，
   *     当这个key（或这些key中的某一个）发生变化时，resolve会被重新触发。
   *     key也可以是一个接收两个参数的判断函数，第一个参数为组件props变化后的值，第二个参数为上一个组件props状态，
   *     返回true表示组件数据无需更新，false表示组件需要重新获取异步数据。
   * map 影响将@resolve内部状态state混入被包装组件组件props的过程。
   *     若map为String，被包装的组件内部可以通过map字段获取resolve返回的异步数据data，
   *     当map为空字符串时data会被展开并混入props。
   *     map也可以是一个接收两个参数的函数，第一个参数为组件props，第二个参数为@resolve内部状态state，
   *     返回值将作为被包装组件的props。
   *     第二个参数是一个对象：
   *     @param loading Boolean 表示异步任务pending状态
   *     @param error Object 异步任务抛出的错误
   *     @param data Object 异步任务返回的数据
   *     @param reload Function @resolve暴露了一个reload函数以允许在外部重启异步任务
   * LoadingComponent 在异步任务pending阶段中，代替被包装的组件接收props并被渲染
   * ErrorComponent 在异步任务reject状态下，代替被包装的组件接收props并被渲染
   */
  const {
    key = [],
    map = (props, state) => ({ ...props, ...state }),
    LoadingComponent,
    ErrorComponent,
  } = options

  const getValue = (object, keyString) => keyString.split('.').reduce(
    (prevKey, currentKey) => prevKey && prevKey[currentKey],
    object,
  )

  let equalfn = key
  if (key instanceof Array) {
    equalfn = (props, prevProps) => key.every(k => getValue(props, k) === getValue(prevProps, k))
  } else if (typeof key === 'string') {
    equalfn = (props, prevProps) => getValue(props, key) === getValue(prevProps, key)
  } else if (typeof key !== 'function') {
    throw new Error('key should be string or array or function')
  }

  let mapfn = map
  if (map === '') {
    mapfn = (props, { data, ...otherState }) => ({ ...props, ...data, ...otherState })
  } else if (typeof map === 'string') {
    mapfn = (props, { data, ...otherState }) => ({ ...props, [map]: data, ...otherState })
  } else if (typeof map !== 'function') {
    throw new Error('map should be string or function')
  }
  return class Resolve extends React.Component {
    static displayName = `resolve(${InnerComponent.displayName || InnerComponent.name})`
    state = { loading: true, data: undefined, error: undefined, prevProps: {} }

    static getDerivedStateFromProps(props, state) {
      return equalfn(props, state.prevProps)
        ? { prevProps: props }
        : { prevProps: props, loading: true }
    }

    componentDidMount() {
      this.loadData()
    }

    componentDidUpdate(prevProps) {
      if (!equalfn(this.props, prevProps)) {
        this.loadData()
      }
    }

    componentWillUnmount() {
      this.$ = null
    }

    loadData = () => {
      const $ = resolve(this.props)
      this.$ = $
      this.$
        .then(data => this.$ === $ && this.setState({
          loading: false,
          error: undefined,
          renderError: undefined,
          data,
        }))
        .catch(error => this.$ === $ && this.setState({ loading: false, error }))
    }

    reload = () => {
      this.setState({ loading: true })
      this.loadData()
    }

    componentDidCatch(error) {
      this.setState({ loading: false, error, renderError: true })
    }

    render() {
      const { loading, data, error } = this.state
      if (this.state.renderError) {
        return this.state.error.toString()
      }
      let Component = InnerComponent
      if (loading && LoadingComponent) {
        Component = LoadingComponent
      } else if (error && ErrorComponent) {
        Component = ErrorComponent
      }

      return React.createElement(
        Component,
        mapfn(this.props, { loading, data, error, reload: this.reload }),
      )
    }
  }
}
