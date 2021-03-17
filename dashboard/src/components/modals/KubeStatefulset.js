import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClickOutside from 'react-click-outside';
import { closeModal, openModal } from '../../actions/modal';
import ShouldRender from '../basic/ShouldRender';
import KubeIndicator from '../monitor/KubeIndicator';
import DataPathHoC from '../DataPathHoC';
import KubeStatefulsetData from './KubeStatefulsetData';

class KubeStatefulset extends React.Component {
    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyBoard);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyBoard);
    }

    handleKeyBoard = e => {
        switch (e.key) {
            case 'Enter':
            case 'Escape':
                return this.handleCloseModal();
            default:
                return false;
        }
    };

    handleCloseModal = () => {
        this.props.closeModal();
    };

    handleStatefulsetData = data => {
        this.props.openModal({
            content: DataPathHoC(KubeStatefulsetData, { data }),
        });
    };

    render() {
        const { data } = this.props;
        const statefulsetData = data.data;
        const logTitle = data.title;

        return (
            <div
                className="ModalLayer-contents"
                tabIndex="-1"
                style={{ marginTop: '40px' }}
            >
                <div className="bs-BIM">
                    <div className="bs-Modal" style={{ width: 600 }}>
                        <ClickOutside onClickOutside={this.handleCloseModal}>
                            <div className="bs-Modal-header">
                                <div
                                    className="bs-Modal-header-copy"
                                    style={{
                                        marginBottom: '10px',
                                        marginTop: '10px',
                                    }}
                                >
                                    <span className="Text-color--inherit Text-display--inline Text-fontSize--20 Text-fontWeight--medium Text-lineHeight--24 Text-typeface--base Text-wrap--wrap">
                                        <span>{logTitle}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="bs-Modal-content">
                                <div className="bs-ObjectList db-UserList">
                                    <div
                                        style={{
                                            overflow: 'hidden',
                                            overflowX: 'auto',
                                        }}
                                    >
                                        <div
                                            id="scheduledEventsList"
                                            className="bs-ObjectList-rows"
                                        >
                                            <ShouldRender
                                                if={
                                                    statefulsetData &&
                                                    statefulsetData.length > 0
                                                }
                                            >
                                                <header className="bs-ObjectList-row bs-ObjectList-row--header">
                                                    <div className="bs-ObjectList-cell">
                                                        Statefulset Name
                                                    </div>
                                                    <div
                                                        className="bs-ObjectList-cell"
                                                        style={{
                                                            marginRight: '10px',
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        Ready
                                                    </div>
                                                </header>
                                            </ShouldRender>
                                            {statefulsetData &&
                                                statefulsetData.map(
                                                    (data, index) => (
                                                        <div
                                                            key={data._id}
                                                            className="scheduled-event-list-item bs-ObjectList-row db-UserListRow db-UserListRow--withName"
                                                            style={{
                                                                backgroundColor:
                                                                    'white',
                                                                cursor:
                                                                    'pointer',
                                                            }}
                                                            id={`statefulsetData_${index}`}
                                                            onClick={() =>
                                                                this.handleStatefulsetData(
                                                                    data
                                                                )
                                                            }
                                                        >
                                                            <div className="bs-ObjectList-cell bs-u-v-middle">
                                                                <div className="bs-ObjectList-cell-row">
                                                                    <KubeIndicator
                                                                        status={
                                                                            data.readyStatefulsets ===
                                                                            data.desiredStatefulsets
                                                                                ? 'healthy'
                                                                                : 'unhealthy'
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                    />
                                                                    {
                                                                        data.statefulsetName
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="bs-ObjectList-cell bs-u-v-middle">
                                                                <div
                                                                    className="bs-ObjectList-cell-row"
                                                                    style={{
                                                                        textAlign:
                                                                            'right',
                                                                    }}
                                                                >
                                                                    {
                                                                        data.readyStatefulsets
                                                                    }
                                                                    /
                                                                    {
                                                                        data.desiredStatefulsets
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                    <ShouldRender
                                        if={
                                            !statefulsetData ||
                                            statefulsetData.length === 0
                                        }
                                    >
                                        <div
                                            className="Box-root Flex-flex Flex-alignItems--center Flex-justifyContent--center"
                                            style={{
                                                textAlign: 'center',
                                                backgroundColor: 'white',
                                                padding: '20px 10px',
                                            }}
                                            id="noprojectDomains"
                                        >
                                            <span>
                                                {!statefulsetData ||
                                                statefulsetData.length === 0
                                                    ? 'Sorry no Statefulset data at this time'
                                                    : null}
                                            </span>
                                        </div>
                                    </ShouldRender>
                                </div>
                            </div>
                            <div className="bs-Modal-footer">
                                <div className="bs-Modal-footer-actions">
                                    <button
                                        id="okBtn"
                                        className="bs-Button bs-DeprecatedButton bs-Button--blue btn__modal"
                                        type="submit"
                                        onClick={this.handleCloseModal}
                                    >
                                        <>
                                            <span>Ok</span>
                                            <span className="create-btn__keycode">
                                                <span className="keycode__icon keycode__icon--enter" />
                                            </span>
                                        </>
                                    </button>
                                </div>
                            </div>
                        </ClickOutside>
                    </div>
                </div>
            </div>
        );
    }
}

KubeStatefulset.displayName = 'KubeStatefulset';

KubeStatefulset.propTypes = {
    closeModal: PropTypes.func.isRequired,
    data: PropTypes.object,
    openModal: PropTypes.func,
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            closeModal,
            openModal,
        },
        dispatch
    );

export default connect(null, mapDispatchToProps)(KubeStatefulset);
