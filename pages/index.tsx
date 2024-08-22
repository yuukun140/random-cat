import { GetServerSideProps, NextPage } from "next"; 
import { useEffect, useState } from "react";
import styles from "./index.module.css";


type Props = {
    initialImageUrl: string;
};

const IndexPage : NextPage<Props> = ({ initialImageUrl }) =>{
    //1.useStateを使って状態を定義する
    const[imageUrl, setImageUrl] = useState(initialImageUrl);
    const[loading, setLoading] = useState(false);
    //2.マウント時に画像を読み込む宣言
    useEffect(() => {
        fetchImage().then((newImage) => {
            setImageUrl(newImage.url);
            setLoading(false);
        });
    }, []);


    //ボタンをクリックしたときに画像を読み込み処理
    const handleClick = async () =>{
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);//画像URLの状態を更新する
        setLoading(false);
    };
    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>他のにゃんこも見る</button>
            <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img}/>}</div>
        </div>
    );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps<Props> = async() => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

type Image = {
    url: string;
};
const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images = await res.json();
    console.log(images);
    return images[0];
};

