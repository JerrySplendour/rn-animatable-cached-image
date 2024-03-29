

import React, { Component } from "react";
import { CacheImageProps } from "./types/ci_types";
import CacheImage_ from "./_CacheImage";


export default function CacheImage(props : CacheImageProps) {
    return (
      <CacheImage_ {...props}/>
    );
  }