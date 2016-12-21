import React from 'react';
import Tab from 'material-ui/Tabs/Tab';
import { intlShape } from 'react-intl';
import cx from 'classnames';

import GeolocationOrInput from './GeolocationOrInput';
import { setEndpoint, setUseCurrent } from '../action/EndpointActions';
import SearchModal from './SearchModal';
import SearchModalLarge from './SearchModalLarge';

class OneTabSearchModal extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    router: React.PropTypes.object,
    location: React.PropTypes.object,
    breakpoint: React.PropTypes.string.isRequired,
  };

  static propTypes = {
    customOnSuggestionSelected: React.PropTypes.func,
    customTabLabel: React.PropTypes.string,
    endpoint: React.PropTypes.object,
    initialValue: React.PropTypes.string.isRequired,
    target: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
    layers: React.PropTypes.array,
    responsive: React.PropTypes.bool, // a switch to force use of fullscreen modal
  };

  componentDidUpdate() {
    if (this.modalIsOpen()) {
      setTimeout(
        () => {
          if(this.geolocationOrInput) {
            this.geolocationOrInput.searchInput.autowhatever.input.focus();
          }
        }, 0
      );
    }
  }

  modalIsOpen = () => {
    if (this.context.location.state) {
      return !(!this.context.location.state.oneTabSearchModalOpen); // bool
    }
    return false;
  }

  onSuggestionSelected = (name, item) => {
    const newLocation = {
      ...this.context.location,
      state: {
        ...this.context.location.state,
        oneTabSearchModalOpen: false,
      },
    }

    if (item.type === 'CurrentLocation') {
      this.context.executeAction(setUseCurrent, {
        target: this.props.target,
        router: this.context.router,
        location: newLocation,
      });
    } else {
      this.context.executeAction(setEndpoint, {
        target: this.props.target,
        endpoint: {
          lat: item.geometry.coordinates[1],
          lon: item.geometry.coordinates[0],
          address: name,
        },
        router: this.context.router,
        location: newLocation,
      });
    }
    this.context.router.goBack();
  };

  render() {
    if (!this.modalIsOpen()) {
      return false;
    }

    let label = (this.props.customTabLabel ?
      this.props.customTabLabel :
      this.context.intl.formatMessage({
        id: this.props.target || 'Origin',
        defaultMessage: this.props.target || 'Origin',
      }));

    label = label.charAt(0).toUpperCase() + label.slice(1);
    let searchTabLabel;
    let Component;
    let responsiveClass = '';
    let placeholder;

    if (this.context.breakpoint === 'large' && this.props.responsive) {
      Component = SearchModalLarge;
      responsiveClass = 'bp-large';
      searchTabLabel = '';
      placeholder = label;
    } else {
      Component = SearchModal;
      searchTabLabel = label;
    }

    return (
      <div className={cx('onetab-search-modal-container', responsiveClass)}>
        <div className={cx('fake-search-container', responsiveClass)}>
          <Component
            selectedTab="tab"
            modalIsOpen
            closeModal={this.context.router.goBack}
          >
            <Tab className="search-header__button--selected" label={searchTabLabel} value="tab">
              <GeolocationOrInput
                ref={(c) => { this.geolocationOrInput = c; }}
                useCurrentPosition={this.props.endpoint && this.props.endpoint.useCurrentPosition}
                initialValue={placeholder ? '' : this.props.initialValue}
                placeholder={placeholder}
                type="endpoint"
                layers={this.props.layers}
                onSuggestionSelected={
                  this.props.customOnSuggestionSelected || this.onSuggestionSelected}
                close={this.context.router.goBack}
              />
            </Tab>
          </Component>
        </div>
      </div>
    );
  }
}

export default OneTabSearchModal;
