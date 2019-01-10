import * as React from 'react'
import './LoadingBar.css'

export default class LoadingBar extends React.PureComponent {
  state = { progress: 0, hide: false }

  unmounted = false

  componentDidMount() {
    setTimeout(this.updateProgress)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      this.updateProgress()
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  updateProgress = () => {
    const { loading } = this.props
    if (this.unmounted || this.state.hide) {
      return
    }
    this.setState(({ progress }) => {
      if (progress === 100) {
        return { hide: true }
      }
      if (!loading) {
        return { progress: 100 }
      }
      if (loading && progress < 90) {
        return { progress: progress + (100 - progress) / 5 }
      }
      return {}
    })
  }


  render() {
    const { progress, hide } = this.state
    return (
      <div
        onTransitionEnd={this.updateProgress}
        className="LoadingBar"
        style={{ width: `${progress}%`, height: hide ? 0 : undefined }}
      />
    )
  }
}
