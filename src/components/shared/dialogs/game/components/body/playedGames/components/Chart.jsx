import {useCallback, useEffect, useRef, useState} from "react";
import {capitalize, getPeriodTitle} from "../../../../../../../../scripts/parsing.js";
import SingleSelectionButtons from "../../../../../../common/singleSelectionButtons/SingleSelectionButtons.jsx";
import Rink from "../../../../images/Rink.png";

function Chart({game}) {
    const defaultWidth = 800;
    const defaultHeight = 340;
    const [data, setData] = useState({
        goals: [],
        shots: [],
        hits: [],
        penalties: [],
        faceoffs: {}
    });
    const [period, setPeriod] = useState(1);
    const [type, setType] = useState("goals");
    const [team, setTeam] = useState(game.homeTeam.id);
    const [width, setWidth] = useState(defaultWidth);
    const [height, setHeight] = useState(defaultHeight);
    const backgroundImage = useRef(null);
    const canvas = useRef(null);

    function getPeriods() {
        let periods = [];
        for (let i = 0; i < game.periodDescriptor.number; i++) {
            if (game.summary?.linescore?.byPeriod[i]) {
                let title = getPeriodTitle(game.gameType,
                    game.summary.linescore.byPeriod[i].periodDescriptor.number,
                    game.summary.linescore.byPeriod[i].periodDescriptor.otPeriods);
                let period = {
                    value: i + 1,
                    text: title,
                    title
                };
                if (i === 0) {
                    period.default = true;
                }
                periods.push(period);
            }
        }
        return periods;
    }

    function getPlayTypes() {
        let types = [];
        for (let i = 0; i < Object.keys(data).length; i++) {
            let key = Object.keys(data)[i];
            let textAndTitle = key.toLowerCase() === "faceoffs" ? capitalize("face-offs") : capitalize(key);
            let type = {
                value: key,
                text: textAndTitle,
                title: textAndTitle
            };
            if (i === 0) {
                type.default = true;
            }
            types.push(type);
        }
        return types;
    }

    function getTeams() {
        let homeTeam = {
            default: true,
            value: game.homeTeam.id,
            text: game.homeTeam.abbrev,
            title: game.homeTeam.abbrev
        };
        let awayTeam = {
            value: game.awayTeam.id,
            text: game.awayTeam.abbrev,
            title: game.awayTeam.abbrev
        };
        return [awayTeam, homeTeam];
    }

    function filterByPeriodAndTeam(data, period, team) {
        let filteredData = {};
        for (let key of Object.keys(data)) {
            if (Array.isArray(data[key])) {
                filteredData[key] = data[key].filter(dataPoint => dataPoint.details.eventOwnerTeamId === team
                                                                  && dataPoint.periodDescriptor.number === period);
            } else {
                if (data.faceoffs && Object.keys(data.faceoffs).length > 0) {
                    filteredData[key] = data[key][period][team];
                }
            }
        }
        return filteredData;
    }

    const drawTeamMarker = useCallback((context, angle, team) => {
        let fontSize = 32 / defaultWidth * width;
        let trapezoidHeight = 44 / defaultWidth * width;
        context.save();
        context.font = `${fontSize}px Roboto, sans-serif`;
        context.fillStyle = "black";
        context.rotate(angle);
        context.textAlign = "center";
        let textMetrics = context.measureText(team.abbrev);
        let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
        context.fillText(team.abbrev, 0, width / 2 - trapezoidHeight / 2 + textHeight / 2);
        context.restore();
    }, [width]);

    const drawTeamMarkerBasedOnPeriod = useCallback((context, periodModulo) => {
        if (period % 2 === periodModulo) {
            drawTeamMarker(context, Math.PI / 2, game.homeTeam);
            drawTeamMarker(context, 3 * Math.PI / 2, game.awayTeam);
        } else {
            drawTeamMarker(context, 3 * Math.PI / 2, game.homeTeam);
            drawTeamMarker(context, Math.PI / 2, game.awayTeam);
        }
    }, [drawTeamMarker, game.awayTeam, game.homeTeam, period]);

    const drawTeamMarkers = useCallback(context => {
        if (game.plays[0]) {
            let homeTeamDefendingSide = game.plays[0].homeTeamDefendingSide;
            if (homeTeamDefendingSide === "left") {
                drawTeamMarkerBasedOnPeriod(context, 1);
            } else if (homeTeamDefendingSide === "right") {
                drawTeamMarkerBasedOnPeriod(context, 0);
            }
        }
    }, [drawTeamMarkerBasedOnPeriod, game.plays]);

    const draw = useCallback((context, xScale, yScale, data) => {
        if (type === "goals") {
            drawDots(data.goals, "red", context, xScale, yScale);
        } else if (type === "shots") {
            drawDots(data.shots, "blue", context, xScale, yScale);
        } else if (type === "hits") {
            drawDots(data.hits, "green", context, xScale, yScale);
        } else if (type === "penalties") {
            drawDots(data.penalties, "purple", context, xScale, yScale);
        } else if (type === "faceoffs") {
            drawFaceoffCounts(data.faceoffs, "black", context, xScale, yScale);
        }
    }, [type]);

    function drawEvents() {
        let context = canvas.current.getContext("2d");
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        context.translate(width / 2, height / 2);
        drawTeamMarkers(context);
        draw(context, width / 200, height / 85, filterByPeriodAndTeam(data, period, team));
    }

    function drawDots(data, style, context, xScale, yScale) {
        let size = 10;
        let sizeX = size * xScale / 5;
        let sizeY = size * yScale / 5;
        let offset = size / 2;
        context.fillStyle = style;
        for (let dataPoint of data) {
            let details = dataPoint.details;
            if (details) {
                context.fillRect(details.xCoord * xScale - offset, details.yCoord * yScale - offset, sizeX, sizeY);
            }
        }
    }

    function drawFaceoffCounts(faceoffs, style, context, xScale, yScale) {
        let size = 16;
        let fontSize = size * xScale / 2;
        let offset = fontSize / 2;
        let backgroundBorderAndTextColor = "white";
        context.font = `${fontSize}px Roboto, sans-serif`;
        context.strokeStyle = style;
        context.fillStyle = style;
        context.textAlign = "center";
        if (faceoffs) {
            for (let key of Object.keys(faceoffs)) {
                let coordinates = key.split(",");
                let x = parseInt(coordinates[0]) * xScale;
                let y = parseInt(coordinates[1]) * yScale;
                let value = faceoffs[key];
                if (y === 0) {
                    let backgroundSize = context.measureText(value).width + size;
                    context.strokeStyle = backgroundBorderAndTextColor;
                    context.roundRect(x - backgroundSize / 2, y - offset, backgroundSize, fontSize, 5);
                    context.stroke();
                    context.fill();
                    context.fillStyle = backgroundBorderAndTextColor;
                    context.fillText(value, x, y + offset / Math.sqrt(2));
                    context.fillStyle = style;
                } else if (y < 0) {
                    context.fillText(value, x, y - offset);
                } else {
                    context.fillText(value, x, y + offset / Math.sqrt(2) * 3.5);
                }
            }
        }
    }

    function makeFaceoffDataStructure() {
        let faceoffPositions = {};
        for (let i = 0; i <= game.periodDescriptor.number; i++) {
            faceoffPositions[i] = {};
            if (i > 0) {
                faceoffPositions[i].total = {};
                faceoffPositions[i][game.awayTeam.id] = {};
                faceoffPositions[i][game.homeTeam.id] = {};
            }
        }
        return faceoffPositions;
    }

    function addFaceoffCounts(playByPlayFaceoffs, faceoffData) {
        for (let faceoff of playByPlayFaceoffs) {
            if (faceoff.periodDescriptor.number && faceoff.details.xCoord && faceoff.details.yCoord) {
                let period = faceoff.periodDescriptor.number;
                let x = faceoff.details.xCoord.toString();
                let y = faceoff.details.yCoord.toString();
                let team = faceoff.details.eventOwnerTeamId;
                if (faceoffData[period].total[`${x},${y}`] === undefined) {
                    faceoffData[period].total[`${x},${y}`] = 1;
                } else {
                    faceoffData[period].total[`${x},${y}`] += 1;
                }
                if (faceoffData[period][team][`${x},${y}`] === undefined) {
                    faceoffData[period][team][`${x},${y}`] = 1;
                } else {
                    faceoffData[period][team][`${x},${y}`] += 1;
                }
            }
        }
    }

    function addFaceoffWins(faceoffData) {
        for (let i = 1; i <= game.periodDescriptor.number; i++) {
            let periodFaceoffs = faceoffData[i];
            for (let key of Object.keys(periodFaceoffs)) {
                if (key !== "total") {
                    let teamPeriodFaceoffs = periodFaceoffs[key];
                    for (let faceoffPosition of Object.keys(teamPeriodFaceoffs)) {
                        let teamWins = teamPeriodFaceoffs[faceoffPosition];
                        let totalFaceoffs = periodFaceoffs.total[faceoffPosition];
                        teamPeriodFaceoffs[faceoffPosition] = `${teamWins}/${totalFaceoffs}`;
                    }
                }
            }
        }
    }

    function getFaceoffCounts(playByPlayFaceoffs) {
        let faceoffData = makeFaceoffDataStructure();
        addFaceoffCounts(playByPlayFaceoffs, faceoffData);
        addFaceoffWins(faceoffData);
        return faceoffData;
    }

    function addEventsToData() {
        let goals = [];
        let shots = [];
        let hits = [];
        let penalties = [];
        let faceoffs = [];
        for (let play of game.plays) {
            switch (play.typeDescKey) {
                case "goal":
                    goals.push(play);
                    break;
                case "shot-on-goal":
                    shots.push(play);
                    break;
                case "hit":
                    hits.push(play);
                    break;
                case "penalty":
                    penalties.push(play);
                    break;
                case "faceoff":
                    faceoffs.push(play);
                    break;
                default:
                    break;
            }
        }
        setData({
            goals,
            shots,
            hits,
            penalties,
            faceoffs: getFaceoffCounts(faceoffs)
        });
    }

    function setUpOnLoad() {
        const onResize = () => {
            if (backgroundImage.current) {
                let imageWidth = backgroundImage.current.width;
                let imageHeight = backgroundImage.current.height;
                let changedWidth = window.innerWidth >= imageWidth
                                   ? imageWidth
                                   : window.document.body.offsetWidth * 0.8;
                setWidth(changedWidth);
                if (window.innerHeight >= imageHeight) {
                    setHeight(imageHeight);
                }
            }
        };
        window.addEventListener("resize", onResize);
        addEventsToData();
        return () => window.removeEventListener("resize", onResize);
    }

    useEffect(drawEvents, [period, type, team, data, width, height, draw, drawTeamMarkers]);

    useEffect(setUpOnLoad, []);

    return <details className={"gamesContent"} open>
        <summary className={"gamesTitle"}>Event chart</summary>
        <div className={"verticalFlex eventChartFilters"}>
            <div className={"verticalFlex eventChartFilter"}>
                <span>Filter by period</span>
                <div className={"horizontalFlex eventChartButtons"}>
                    <SingleSelectionButtons buttonData={getPeriods()}
                                            setData={period => setPeriod(parseInt(period))}>
                    </SingleSelectionButtons>
                </div>
            </div>
            <div className={"verticalFlex eventChartFilter"}>
                <span>Filter by type</span>
                <div className={"horizontalFlex eventChartButtons"}>
                    <SingleSelectionButtons buttonData={getPlayTypes()}
                                            setData={type => setType(type)}>
                    </SingleSelectionButtons>
                </div>
            </div>
            <div className={"verticalFlex eventChartFilter"}>
                <span>Filter by team</span>
                <div className={"horizontalFlex eventChartButtons"}>
                    <SingleSelectionButtons buttonData={getTeams()}
                                            setData={team => setTeam(parseInt(team))}>
                    </SingleSelectionButtons>
                </div>
            </div>
        </div>
        <div className={"eventChart"}>
            <img ref={backgroundImage} className={"rink"} src={Rink} alt={"Ice hockey rink"}/>
            <img className={"centerIceLogo"} src={game.homeTeam.logo} alt={`${game.homeTeam.abbrev} logo`}/>
            <canvas aria-label={"Event chart"}
                    role={"img"}
                    ref={canvas}
                    className={"events"}
                    width={width}
                    height={height}>
                Event chart
            </canvas>
        </div>
    </details>;
}

export default Chart;
