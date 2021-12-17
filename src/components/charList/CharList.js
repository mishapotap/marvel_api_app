import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import "./charList.scss";

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
    };

    marvelService = new MarvelService(); // Got this.marvelService new property

    componentDidMount() {
        this.onRequest();
    } // Hook

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }; // Main (Get the massive of all characters by offset (), set them in state. Catch the error)

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        });
    }; // Helper

    onCharListLoaded = (newCharList) => {
        this.setState(({ charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
        }));
    }; // Helper (Set the charList in state) Add new characters to charlist by clicking the button "Load more"

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    }; // Helper (Set the error in state)

    renderItems(arr) {
        const items = arr.map((item) => {
            let imgStyle = { objectFit: "cover" };
            if (
                item.thumbnail ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
            ) {
                imgStyle = { objectFit: "unset" };
            } // Center the img

            return (
                <li className="char__item" key={item.id}>
                    <img
                        src={item.thumbnail}
                        alt={item.name}
                        style={imgStyle}
                        onClick={() => this.props.onSelectedChar(item.id)}
                    />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });
        return <ul className="char__grid">{items}</ul>;
    } // Main method for optimisation

    render() {
        const { charList, loading, error } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

export default CharList;
