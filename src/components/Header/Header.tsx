import './header.css';

type Props = {
  indicatorName: string;
};

export const Header = ({ indicatorName }: Props) => {
  return (
    <header className="App-header">
      <div className="indicator-infos">
        <div>{indicatorName}</div>
      </div>
    </header>
  );
};
