package com.example.swd.controller;


import com.example.swd.dto.request.ApiResponse;
import com.example.swd.dto.request.RoleRequest;
import com.example.swd.dto.response.RoleResponse;
import com.example.swd.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleController {
    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> create(@RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getAll() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAll())
                .build();
    }

    @PutMapping("/{roleId}")
    ApiResponse<RoleResponse> update(@PathVariable String roleId, @RequestBody RoleRequest request) {
        ApiResponse<RoleResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(roleService.update(roleId, request));
        return apiResponse;
    }

    @DeleteMapping("/{roleId}")
    ApiResponse<Void> delete(@PathVariable String roleId) {
        roleService.delete(roleId);
        return ApiResponse.<Void>builder().build();
    }

}
