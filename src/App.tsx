import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { mergeSort } from "./mergesort";
import LineTo from "react-lineto";
import * as _ from "lodash";
import "./index.css";
import { motion } from "framer-motion";

function App() {
  const [array, setArray] = useState<number[]>([]);
  const [mergeStates, setMergeStates] = useState<
    { value: number[]; depth: number; type: "node" | "merged" }[]
  >([]);

  const clubbedDepthStates = useMemo(() => {
    return mergeStates.reduce(
      (
        p: Record<number, number[][]>,
        c: { value: number[]; depth: number; type: "node" | "merged" }
      ) => {
        const oldState = p[c.depth] ?? [];
        return {
          ...p,
          [c.depth]: [...oldState, c.value],
        };
      },
      {}
    );
  }, [mergeStates]);

  const clubbedDepthKeys = useMemo(() => {
    return Object.keys(clubbedDepthStates);
  }, [clubbedDepthStates]);

  useEffect(() => {
    const states: any[] = [];
    mergeSort(array, states);
    setMergeStates([...states]);
  }, [array]);
  // array input handler
  const [inputValue, setInputValue] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  // array submit handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numberArray = inputValue
      .split(",")
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));
    setArray(numberArray);
    console.log(array);
  };

  return (
    <div className="flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter numbers separated by commas"
          className="p-2 border border-gray-300 rounded mb-4"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      <div className="flex-col">
        <p>Merge Sort Visual</p>
        {clubbedDepthKeys.map((depth: string, idx: number) => {
          const calcMargin =
            parseInt(depth) >= 0
              ? `${parseInt(depth) * 0.3}rem`
              : `${parseInt(depth) * -0.3}rem`;
          const calcMinHeight =
            parseInt(depth) >= 0
              ? `${parseInt(depth) * 2}rem`
              : `${parseInt(depth) * -2}rem`;
          return (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className={`value`}
                style={{ minHeight: calcMinHeight }}
              >
                {clubbedDepthStates[parseInt(depth)].map(
                  (v: any[], lIdx: number) => {
                    let currentValues = [...v];
                    const toClasses: string[] = [];

                    let nextDepthIdx = idx + 1;

                    while (currentValues.length != 0) {
                      // @ts-ignore
                      const nextDepthElems: any[][] =
                        clubbedDepthStates[
                          parseInt(clubbedDepthKeys[nextDepthIdx])
                        ];
                      if (!nextDepthElems) {
                        break;
                      }
                      nextDepthElems?.forEach((elems, nIdx) => {
                        const intersection = _.intersection(
                          elems,
                          currentValues
                        );
                        if (intersection?.length > 0) {
                          // Remove from current Values
                          toClasses.push(
                            `value${clubbedDepthKeys[nextDepthIdx]}${nIdx}`
                          );
                          _.remove(currentValues, function (n) {
                            return elems?.includes(n);
                          });
                        }
                      });
                      nextDepthIdx += 1;
                    }
                    const renderLines = (from: string, toClasses: string[]) => {
                      return toClasses.map((toClass) => {
                        return (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2 }}
                          >
                            <LineTo
                              from={from}
                              to={toClass}
                              borderColor="white"
                              borderWidth={1.5}
                              borderStyle="dashed"
                              zIndex={-1}
                              fromAnchor="bottom center"
                              toAnchor="top center"
                            />
                          </motion.div>
                        );
                      });
                    };

                    return (
                      <>
                        <span
                          className={`border-box value${depth}${lIdx}`}
                          style={{ margin: "0.5rem", padding: calcMargin }}
                        >
                          {v.join(" | ")}
                        </span>
                        {renderLines(`value${depth}${lIdx}`, toClasses)}
                      </>
                    );
                  }
                )}
              </motion.div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default App;
